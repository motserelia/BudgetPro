function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
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
        error: "Supabase messages environment variables are not configured",
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
      const url = `${supabaseUrl}/rest/v1/messages?user_id=eq.${encodeURIComponent(
        userId,
      )}&select=*&order=created_at.desc`;
      const { response, json, text } = await supabaseFetch(url, {
        method: "GET",
        headers: {
          ...buildAuthHeaders(supabaseKey),
          Accept: "application/json",
        },
      });

      const rows = Array.isArray(json) ? json : [];
      res.statusCode = response.status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          ok: response.ok,
          messages: rows.length ? rows : null,
          upstreamStatus: response.status,
          upstreamBody: response.ok ? undefined : text,
        }),
      );
      return;
    }

    if (req.method === "POST") {
      const payload = await readJsonBody(req);
      const userId =
        typeof payload?.user_id === "string" ? payload.user_id.trim() : "";
      const messages = payload?.messages;
      if (!userId || !Array.isArray(messages)) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(
          JSON.stringify({ ok: false, error: "Invalid messages payload" }),
        );
        return;
      }

      // Build rows for upsert into messages table.
      const rows = messages.map((m) => {
        const id =
          m.id ||
          (typeof crypto !== "undefined" &&
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}_${Math.random().toString(36).slice(2)}`);
        return {
          id,
          user_id: userId,
          profile_id:
            m.profile_id ?? m.profileId ?? m.from_profile ?? m.fromProfile ?? null,
          name: m.name ?? null,
          email: m.email ?? null,
          phone: m.phone ?? null,
          category: m.category ?? null,
          message: m.message ?? null,
          creator_reply: m.creator_reply ?? null,
          replied: typeof m.replied === "boolean" ? m.replied : false,
          read_by_creator:
            typeof m.read_by_creator === "boolean" ? m.read_by_creator : false,
          reply_read_by_user:
            typeof m.reply_read_by_user === "boolean"
              ? m.reply_read_by_user
              : false,
          created_at: m.created_at ?? new Date().toISOString(),
          reply_date: m.reply_date ?? null,
          from_profile: m.from_profile ?? m.fromProfile ?? null,
          from_profile_name:
            m.from_profile_name ?? m.fromProfileName ?? null,
        };
      });

      const url = `${supabaseUrl}/rest/v1/messages?on_conflict=id,user_id`;
      const { response, json, text } = await supabaseFetch(url, {
        method: "POST",
        headers: {
          ...buildAuthHeaders(supabaseKey),
          "Content-Type": "application/json",
          Prefer: "return=representation, resolution=merge-duplicates",
        },
        body: JSON.stringify(rows),
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
        error: error?.message || "Unexpected messages proxy error",
      }),
    );
  }
};
