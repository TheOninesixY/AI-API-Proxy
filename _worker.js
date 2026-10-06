const TARGET = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const clientUrl = new URL(request.url);
    const rawKey =
      request.headers.get("x-goog-api-key") ||
      clientUrl.searchParams.get("key") ||
      "";

    const keys = rawKey
      .split(",")
      .map(key => key.trim())
      .filter(Boolean);

    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const headers = new Headers(request.headers);
    headers.delete("x-goog-api-key");

    if (!keys.length) {
      const targetUrl = new URL(`${TARGET}${clientUrl.pathname}${clientUrl.search}`);

      return fetch(new Request(targetUrl, {
        method: request.method,
        headers,
        body,
        redirect: request.redirect
      }), {
        cache: "no-store"
      });
    }

    for (let i = 0; i < keys.length; i++) {
      const targetUrl = new URL(`${TARGET}${clientUrl.pathname}`);

      clientUrl.searchParams.forEach((value, name) => {
        if (name !== "key") {
          targetUrl.searchParams.append(name, value);
        }
      });

      targetUrl.searchParams.set("key", keys[i]);

      const response = await fetch(new Request(targetUrl, {
        method: request.method,
        headers,
        body,
        redirect: request.redirect
      }), {
        cache: "no-store"
      });

      if (response.status !== 429 && response.status !== 503) {
        return response;
      }

      if (i === keys.length - 1) {
        return response;
      }
    }
  }
};
