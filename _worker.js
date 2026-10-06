const GEMINI_API = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);

    const headerKey = request.headers.get("x-goog-api-key");
    const queryKey = incomingUrl.searchParams.get("key");

    const rawKeys = headerKey ?? queryKey ?? "";

    const keys = rawKeys
      .split(",")
      .map(key => key.trim())
      .filter(Boolean);

    const targetUrl = new URL(
      GEMINI_API + incomingUrl.pathname + incomingUrl.search
    );

    if (queryKey !== null) {
      targetUrl.searchParams.delete("key");
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }

    if (keys.length === 0) {
      return fetch(
        new Request(targetUrl.toString(), request)
      );
    }

    for (const key of keys) {
      const proxiedRequest = new Request(
        targetUrl.toString(),
        request
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
