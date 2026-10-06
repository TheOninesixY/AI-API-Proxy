const TARGET = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);
    const rawKey =
      incomingUrl.searchParams.get("key") ||
      request.headers.get("x-goog-api-key") ||
      "";

    const keys = rawKey
      .split(",")
      .map(key => key.trim())
      .filter(Boolean);

    if (!keys.length) {
      return fetch(
        new Request(`${TARGET}${incomingUrl.pathname}${incomingUrl.search}`, request)
      );
    }

    for (const key of keys) {
      const url = new URL(`${TARGET}${incomingUrl.pathname}`);

      incomingUrl.searchParams.forEach((value, name) => {
        if (name !== "key") {
          url.searchParams.append(name, value);
        }
      });

      url.searchParams.set("key", key);

      const headers = new Headers(request.headers);
      headers.delete("x-goog-api-key");

      const response = await fetch(
        new Request(url, {
          method: request.method,
          headers,
          body:
            request.method === "GET" || request.method === "HEAD"
              ? undefined
              : request.body,
          redirect: request.redirect
        })
      );

      if (response.status !== 429) {
        return response;
      }

      if (key === keys[keys.length - 1]) {
        return response;
      }
    }
  }
};
