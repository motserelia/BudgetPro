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

function parseJwtPayload(token) {
  try {
    const parts = String(token || "").split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
  } catch (e) {
    return null;
  }
}

function normalizeSession(json) {
  const accessToken = String(json?.access_token || "");
  const refreshToken = String(json?.refresh_token || "");
  const expiresIn = Number(json?.expires_in || 0);
  const expiresAtRaw = Number(json?.expires_at || 0);
  const payload = parseJwtPayload(accessToken);
  const emailFromPayload =
    payload && typeof payload.email === "string" ? payload.email : "";
  const emailFromUser =
    json?.user && typeof json.user.email === "string" ? json.user.email : "";
  const expiresAt =
    expiresAtRaw > 0
      ? expiresAtRaw
      : expiresIn > 0
        ? Math.floor(Date.now() / 1000) + expiresIn
        : 0;

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
    email: emailFromUser || emailFromPayload,
  };
}

function classifyRefreshError(status, json, text) {
  const message = String(
    json?.error_description || json?.msg || json?.error || text || "",
  ).toLowerCase();
  if (
    status === 400 ||
    status === 401 ||
    /invalid refresh token|refresh token.*invalid|invalid grant|grant|session not found|revoked|expired|already used/.test(
      message,
    )
  ) {
    return "refresh_token_invalid";
  }
  return "refresh_failed";
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

  const { supabaseUrl, supabaseAnonKey } = readEnv();
  if (!supabaseUrl || !supabaseAnonKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "refresh_failed" }));
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const refreshToken =
      typeof payload?.refresh_token === "string"
        ? payload.refresh_token.trim()
        : "";

    if (!refreshToken) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: false, error: "refresh_token_invalid" }));
      return;
    }

    const url = `${supabaseUrl}/auth/v1/token?grant_type=refresh_token`;
    const { response, json, text } = await supabaseFetch(url, {
      method: "POST",
      headers: {
        ...buildAuthHeaders(supabaseAnonKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    const normalizedSession = normalizeSession(json);
    if (
      !response.ok ||
      !normalizedSession.access_token ||
      !normalizedSession.refresh_token ||
      !normalizedSession.expires_at
    ) {
      res.statusCode = response.ok ? 400 : response.status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          ok: false,
          error: classifyRefreshError(response.status, json, text),
        }),
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        ok: true,
        session: normalizedSession,
      }),
    );
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "refresh_failed" }));
  }
};
