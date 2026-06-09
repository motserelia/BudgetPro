function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readEnv() {
  const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
  return {
    supabaseUrl,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    redirectUrl:
      process.env.BUDGETPRO_AUTH_REDIRECT_URL || "https://budgetpro.app/",
  };
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function supabaseFetch(urlPath, options) {
  const response = await fetch(urlPath, options);
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {}
  return { response, json, text };
}

function buildAuthHeaders(supabaseAnonKey) {
  return {
    Authorization: `Bearer ${supabaseAnonKey}`,
    apikey: supabaseAnonKey,
  };
}

function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function safeAuthError(json) {
  const msg =
    typeof json?.msg === "string"
      ? json.msg
      : typeof json?.error_description === "string"
        ? json.error_description
        : typeof json?.error === "string"
          ? json.error
          : null;

  if (!msg) return "Failed to send magic link";
  if (/rate limit/i.test(msg)) return "Too many requests. Try again later.";
  if (/invalid email/i.test(msg)) return "Invalid email address.";
  return "Failed to send magic link";
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end("");
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "Method Not Allowed" }));
    return;
  }

  const { supabaseUrl, supabaseAnonKey, redirectUrl } = readEnv();
  if (!supabaseUrl || !supabaseAnonKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        ok: false,
        error: "Supabase auth environment variables are not configured",
      }),
    );
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const email =
      typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";

    if (!isValidEmail(email)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: false, error: "Invalid email address" }));
      return;
    }

    const url = `${supabaseUrl}/auth/v1/otp`;
    const { response, json, text } = await supabaseFetch(url, {

    console.log("[BP_SUPABASE_STATUS]", response.status);
    console.log("[BP_SUPABASE_RESPONSE]", text);

      method: "POST",
      headers: {
        ...buildAuthHeaders(supabaseAnonKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        options: {
          email_redirect_to: redirectUrl,
          should_create_user: true,
        },
      }),
    });

    console.log("SUPABASE STATUS:", response.status);
    console.log("SUPABASE JSON:", JSON.stringify(json));

    res.statusCode = response.ok ? 200 : response.status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify(
        response.ok
          ? { ok: true }
          : { ok: false, error: safeAuthError(json) },
      ),
    );
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        ok: false,
        error: error?.message || "Unexpected auth proxy error",
      }),
    );
  }
};
