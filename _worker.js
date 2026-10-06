const TARGET = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    const rawKey =
      request.headers.get("x-goog-api-key") ??
      url.searchParams.get("key") ??
      "";

    const keys = rawKey
      .split(",")
      .map(key => key.trim())
      .filter(Boolean);

    const target = new URL(
      `${TARGET}${url.pathname}${url.search}`
    );

    target.searchParams.delete("key");

    const headers = new Headers();

    for (const [key, value] of request.headers) {
      if (key.toLowerCase() === "content-type") {
        headers.set(key, value);
      }
    }

    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.clone().arrayBuffer();

    if (keys.length === 0) {
      return fetch(target.toString(), {
        method: request.method,
        headers,
        body
      });
    }

    for (const key of keys) {
      headers.set("x-goog-api-key", key);

      const response = await fetch(target.toString(), {
        method: request.method,
        headers,
        body
      });

      if (response.status !== 429 && response.status !== 503) {
        return response;
      }
    }
  }
};
