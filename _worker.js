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

    if (!keys.length) {
      return fetch(new Request(`${TARGET}${clientUrl.pathname}${clientUrl.search}`, request), {
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

      const headers = new Headers(request.headers);
      headers.delete("x-goog-api-key");

      const response = await fetch(
        new Request(targetUrl, {
          method: request.method,
          headers,
          body: request.method === "GET" || request.method === "HEAD"
            ? undefined
            : request.clone().body,
          redirect: request.redirect
        }),
        {
          cache: "no-store"
        }
      );

      if (response.status !== 429 && response.status !== 503) {
        return response;
      }

      if (i === keys.length - 1) {
        return response;
      }
    }
  }
};
