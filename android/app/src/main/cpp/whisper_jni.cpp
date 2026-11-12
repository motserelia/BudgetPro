// JNI boundary for the bundled whisper.cpp engine (v1.9.5).
// No logging, no storage, no networking: audio arrives as float PCM, text leaves as a UTF-8 string.
#include <jni.h>

#include <algorithm>
#include <atomic>
#include <cstdint>
#include <mutex>
#include <new>
#include <string>

#include "whisper.h"

namespace {

/** One loaded model plus the last run's diagnostics; owned by the native side only. */
struct engine {
    whisper_context * ctx = nullptr;
    std::atomic<bool> cancel{false};
    std::mutex inference;
    std::string detected = "und";
    int segments = 0;
    float no_speech = 0.0f;
};

engine * handle(jlong value) {
    return reinterpret_cast<engine *>(static_cast<intptr_t>(value));
}

std::string to_string(JNIEnv * env, jstring value) {
    if (value == nullptr) return std::string();
    const char * chars = env->GetStringUTFChars(value, nullptr);
    if (chars == nullptr) return std::string();
    std::string text(chars);
    env->ReleaseStringUTFChars(value, chars);
    return text;
}

void throw_code(JNIEnv * env, const char * code) {
    jclass type = env->FindClass("java/lang/IllegalStateException");
    if (type == nullptr) return;
    env->ThrowNew(type, code);
    env->DeleteLocalRef(type);
}

bool abort_requested(void * data) {
    return static_cast<engine *>(data)->cancel.load(std::memory_order_relaxed);
}

std::string trimmed(const std::string & value) {
    const size_t first = value.find_first_not_of(" \t\r\n");
    if (first == std::string::npos) return std::string();
    const size_t last = value.find_last_not_of(" \t\r\n");
    return value.substr(first, last - first + 1);
}

/** Markers whisper.cpp emits for silence, music or noise. They are never a financial phrase. */
bool non_speech(const std::string & text) {
    static const char * markers[] = {
        "[BLANK_AUDIO]", "[MUSIC]", "[NOISE]", "[SOUND]", "[APPLAUSE]", "[LAUGHTER]", "[INAUDIBLE]",
        "(silence)", "(music)", "(noise)", "(applause)", "(laughter)",
    };
    for (const char * marker : markers) {
        if (text == marker) return true;
    }
    return false;
}

} // namespace

extern "C" JNIEXPORT jstring JNICALL
Java_pro_budget_app_voice_WhisperBridge_nativeBuild(JNIEnv * env, jclass) {
    return env->NewStringUTF(whisper_version());
}

extern "C" JNIEXPORT jlong JNICALL
Java_pro_budget_app_voice_WhisperBridge_nativeInit(JNIEnv * env, jclass, jstring model_path) {
    const std::string path = to_string(env, model_path);
    if (path.empty()) return 0;
    whisper_context_params params = whisper_context_default_params();
    params.use_gpu = false;   // CPU only: no GPU backend is packaged in the APK
    params.flash_attn = false;
    whisper_context * ctx = whisper_init_from_file_with_params(path.c_str(), params);
    if (ctx == nullptr) return 0;
    engine * created = new (std::nothrow) engine();
    if (created == nullptr) {
        whisper_free(ctx);
        return 0;
    }
    created->ctx = ctx;
    return static_cast<jlong>(reinterpret_cast<intptr_t>(created));
}

extern "C" JNIEXPORT jstring JNICALL
Java_pro_budget_app_voice_WhisperBridge_nativeTranscribe(
        JNIEnv * env, jclass, jlong value, jfloatArray samples, jstring language, jint threads, jfloat no_speech_thold) {
    engine * model = handle(value);
    if (model == nullptr || model->ctx == nullptr) {
        throw_code(env, "WHISPER_NATIVE_UNAVAILABLE");
        return nullptr;
    }
    const jsize count = samples == nullptr ? 0 : env->GetArrayLength(samples);
    if (count <= 0) {
        throw_code(env, "WHISPER_INVALID_WAV");
        return nullptr;
    }
    std::lock_guard<std::mutex> lock(model->inference);
    model->cancel.store(false, std::memory_order_relaxed);
    jfloat * pcm = env->GetFloatArrayElements(samples, nullptr);
    if (pcm == nullptr) {
        throw_code(env, "WHISPER_LOW_MEMORY");
        return nullptr;
    }

    const std::string lang = to_string(env, language);
    whisper_full_params params = whisper_full_default_params(WHISPER_SAMPLING_GREEDY);
    params.print_progress = false;
    params.print_realtime = false;
    params.print_timestamps = false;
    params.print_special = false;
    params.translate = false;
    params.n_threads = threads > 0 ? threads : 2;
    params.no_context = true;
    params.no_timestamps = true;
    params.single_segment = false;
    params.suppress_blank = true;
    params.suppress_nst = true;
    params.temperature = 0.0f;
    params.temperature_inc = 0.0f;   // no sampled fallback: deterministic and faster on a phone
    params.no_speech_thold = no_speech_thold > 0.0f ? no_speech_thold : 0.6f;
    // whisper.cpp returns the detected language and no segments when detect_language is true,
    // so language detection happens in a normal pass over the model instead.
    params.detect_language = false;
    params.language = lang.empty() ? "auto" : lang.c_str();
    params.abort_callback = abort_requested;
    params.abort_callback_user_data = model;

    const int rc = whisper_full(model->ctx, params, pcm, count);
    env->ReleaseFloatArrayElements(samples, pcm, JNI_ABORT);

    if (model->cancel.exchange(false, std::memory_order_relaxed)) {
        model->detected = "und";
        model->segments = 0;
        model->no_speech = 0.0f;
        throw_code(env, "WHISPER_CANCELLED");
        return nullptr;
    }
    if (rc != 0) {
        model->detected = "und";
        model->segments = 0;
        model->no_speech = 0.0f;
        throw_code(env, "WHISPER_INFERENCE_FAILED");
        return nullptr;
    }

    std::string transcript;
    float worst_no_speech = 0.0f;
    const int segments = whisper_full_n_segments(model->ctx);
    for (int i = 0; i < segments; ++i) {
        const char * raw = whisper_full_get_segment_text(model->ctx, i);
        if (raw == nullptr) continue;
        const std::string part = trimmed(raw);
        if (part.empty() || non_speech(part)) continue;
        if (!transcript.empty()) transcript.push_back(' ');
        transcript += part;
        worst_no_speech = std::max(worst_no_speech, whisper_full_get_segment_no_speech_prob(model->ctx, i));
    }
    const int language_id = whisper_full_lang_id(model->ctx);
    const char * language_name = language_id >= 0 ? whisper_lang_str(language_id) : nullptr;
    model->detected = language_name != nullptr ? language_name : "und";
    model->segments = segments;
    model->no_speech = worst_no_speech;

    return env->NewStringUTF(transcript.c_str());
}

extern "C" JNIEXPORT jstring JNICALL
Java_pro_budget_app_voice_WhisperBridge_nativeDetectedLanguage(JNIEnv * env, jclass, jlong value) {
    engine * model = handle(value);
    return env->NewStringUTF(model == nullptr ? "und" : model->detected.c_str());
}

extern "C" JNIEXPORT jint JNICALL
Java_pro_budget_app_voice_WhisperBridge_nativeSegments(JNIEnv *, jclass, jlong value) {
    engine * model = handle(value);
    return model == nullptr ? 0 : model->segments;
}

extern "C" JNIEXPORT jfloat JNICALL
Java_pro_budget_app_voice_WhisperBridge_nativeNoSpeechProb(JNIEnv *, jclass, jlong value) {
    engine * model = handle(value);
    return model == nullptr ? 0.0f : model->no_speech;
}

extern "C" JNIEXPORT void JNICALL
Java_pro_budget_app_voice_WhisperBridge_nativeCancel(JNIEnv *, jclass, jlong value) {
    engine * model = handle(value);
    if (model != nullptr) model->cancel.store(true, std::memory_order_relaxed);
}

extern "C" JNIEXPORT void JNICALL
Java_pro_budget_app_voice_WhisperBridge_nativeFree(JNIEnv *, jclass, jlong value) {
    engine * model = handle(value);
    if (model == nullptr) return;
    model->cancel.store(true, std::memory_order_relaxed);
    {
        std::lock_guard<std::mutex> lock(model->inference);  // wait for an aborted run to leave whisper_full
    }
    if (model->ctx != nullptr) whisper_free(model->ctx);
    model->ctx = nullptr;
    delete model;
}
