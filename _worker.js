const TARGET = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": request.headers.get("Origin") || "*",
          "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
          "Access-Control-Allow-Headers":
            request.headers.get("Access-Control-Request-Headers") || "*",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    const rawKey =
      request.headers.get("x-goog-api-key") ||
      url.searchParams.get("key") ||
      "";

    const keys = rawKey
      .split(",")
      .map(k => k.trim())
      .filter(Boolean);

    const targetUrl = new URL(
      `${TARGET}${url.pathname}${url.search}`
    );

    if (keys.length > 0) {
      targetUrl.searchParams.delete("key");
    }

    if (keys.length === 0) {
      return fetch(new Request(targetUrl, request.clone()));
    }

    for (const key of keys) {
      const proxiedRequest = new Request(
        targetUrl,
        request.clone()
      );

      proxiedRequest.headers.set("x-goog-api-key", key);

      const response = await fetch(proxiedRequest);

      if (response.status !== 429 && response.status !== 503) {
        return response;
      }

      if (key === keys[keys.length - 1]) {
        return response;
      }
    }
  }
};
