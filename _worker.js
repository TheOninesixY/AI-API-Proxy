export default {
  async fetch(request, env) {
    const targetBaseUrl = "https://generativelanguage.googleapis.com";
    const url = new URL(request.url);
    const apiKeys = (env.GEMINI_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);

    if (apiKeys.length > 0) {
      const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
      if (url.searchParams.has("key")) {
        url.searchParams.set("key", randomKey);
      }
    }

    const modifiedHeaders = new Headers(request.headers);
    if (apiKeys.length > 0) {
      const authHeader = modifiedHeaders.get("Authorization");
      const xApiKeyHeader = modifiedHeaders.get("x-goog-api-key");
      const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

      if (authHeader && authHeader.startsWith("Bearer ")) {
        modifiedHeaders.set("Authorization", `Bearer ${randomKey}`);
      } else if (xApiKeyHeader) {
        modifiedHeaders.set("x-goog-api-key", randomKey);
      }
    }

    return fetch(new Request(`${targetBaseUrl}${url.pathname}${url.search}`, {
      method: request.method,
      headers: modifiedHeaders,
      body: request.body,
      redirect: request.redirect
    }));
  }
};
