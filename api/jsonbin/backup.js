function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readEnv() {
  return {
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseKey: process.env.SUPABASE_SECRET_KEY || "",
  };
}

function getRequestUserId(req) {
  const queryUserId =
    typeof req.query?.user_id === "string" ? req.query.user_id.trim() : "";
  const bodyUserId =
    typeof req.body?.user_id === "string" ? req.body.user_id.trim() : "";
  return queryUserId || bodyUserId || "";
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

function buildAuthHeaders(supabaseKey) {
  return {
    Authorization: `Bearer ${supabaseKey}`,
    apikey: supabaseKey,
  };
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end("");
    return;
  }

  const { supabaseUrl, supabaseKey } = readEnv();
  if (!supabaseUrl || !supabaseKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        ok: false,
        error: "Supabase backup environment variables are not configured",
      }),
    );
    return;
  }

  try {
    if (req.method === "GET") {
      const userId = getRequestUserId(req);
      if (!userId) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ ok: false, error: "Missing user_id" }));
        return;
      }
      const url = `${supabaseUrl}/rest/v1/backups?user_id=eq.${encodeURIComponent(
        userId,
      )}&select=backup_data,updated_at,created_at&order=updated_at.desc&limit=1`;
      const { response, json, text } = await supabaseFetch(url, {
        method: "GET",
        headers: {
          ...buildAuthHeaders(supabaseKey),
          Accept: "application/json",
        },
      });

      const row = Array.isArray(json) && json.length ? json[0] : null;

      res.statusCode = response.status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          ok: response.ok,
          record: row?.backup_data ?? null,
          updated: row?.updated_at ?? row?.created_at ?? null,
          upstreamStatus: response.status,
          upstreamBody: response.ok ? undefined : text,
        }),
      );
      return;
    }

    if (req.method === "POST" || req.method === "PUT") {
      const payload = await readJsonBody(req);
      const userId =
        typeof payload?.user_id === "string" ? payload.user_id.trim() : "";
      const backupPayload = payload?.backup;
      if (
        !userId ||
        !backupPayload ||
        typeof backupPayload !== "object" ||
        Array.isArray(backupPayload)
      ) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ ok: false, error: "Invalid backup payload" }));
        return;
      }

      // Upsert single row by user_id (do not set updated_at here if DB handles it)
      const upsertRow = {
        user_id: userId,
        backup_data: backupPayload,
      };
      const url = `${supabaseUrl}/rest/v1/backups?on_conflict=user_id`;
      const { response, json, text } = await supabaseFetch(url, {
        method: "POST",
        headers: {
          ...buildAuthHeaders(supabaseKey),
          "Content-Type": "application/json",
          Prefer: "return=representation, resolution=merge-duplicates",
        },
        body: JSON.stringify([upsertRow]),
      });

      res.statusCode = response.status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          ok: response.ok,
          metadata: json ?? null,
          upstreamStatus: response.status,
          upstreamBody: response.ok ? undefined : text,
        }),
      );
      return;
    }

    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "Method Not Allowed" }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        ok: false,
        error: error?.message || "Unexpected backup proxy error",
      }),
    );
  }
};
