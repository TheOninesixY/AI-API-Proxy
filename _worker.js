const TARGET = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const incoming = new URL(request.url);

    const headerKey = request.headers.get("x-goog-api-key");
    const queryKey = incoming.searchParams.get("key");
    const rawKey = headerKey || queryKey || "";

    const keys = rawKey
      .split(",")
      .map(key => key.trim())
      .filter(Boolean);

    if (!keys.length) {
      const target = new URL(
        TARGET + incoming.pathname + incoming.search
      );

      return fetch(new Request(target, request), {
        cache: "no-store"
      });
    }

    const headers = new Headers(request.headers);
    headers.delete("content-length");
    headers.delete("x-goog-api-key");

    for (const key of keys) {
      const target = new URL(
        TARGET + incoming.pathname
      );

      for (const [name, value] of incoming.searchParams) {
        if (name !== "key") {
          target.searchParams.append(name, value);
        }
      }

      const retryRequest = new Request(target, {
        method: request.method,
        headers,
        body: request.method === "GET" || request.method === "HEAD"
          ? undefined
          : request.clone().body,
        redirect: request.redirect
      });

      retryRequest.headers.set("x-goog-api-key", key);

      const response = await fetch(retryRequest, {
        cache: "no-store"
      });

      if (response.status !== 429 && response.status !== 503) {
        return response;
      }

      if (key === keys[keys.length - 1]) {
        return response;
      }
    }
  }
};
