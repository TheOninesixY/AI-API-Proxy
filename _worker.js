const TARGET = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    const headerKey = request.headers.get("x-goog-api-key");
    const queryKey = url.searchParams.get("key");
    const rawKey = headerKey || queryKey || "";

    const keys = rawKey
      .split(",")
      .map(key => key.trim())
      .filter(Boolean);

    if (keys.length === 0) {
      const target = new URL(
        TARGET + url.pathname + url.search
      );

      return fetch(target, {
        method: request.method,
        headers: request.headers,
        body: request.method === "GET" || request.method === "HEAD"
          ? undefined
          : request.body,
        redirect: request.redirect
      });
    }

    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const headers = new Headers(request.headers);

    headers.delete("x-goog-api-key");
    headers.delete("content-length");

    for (const key of keys) {
      const target = new URL(
        TARGET + url.pathname
      );

      for (const [name, value] of url.searchParams) {
        if (name !== "key") {
          target.searchParams.append(name, value);
        }
      }

      headers.set("x-goog-api-key", key);

      const response = await fetch(target, {
        method: request.method,
        headers,
        body,
        redirect: request.redirect,
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
