const TARGET = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = `${TARGET}${url.pathname}${url.search}`;

    const rawKey =
      request.headers.get("x-goog-api-key") ||
      url.searchParams.get("key") ||
      "";

    const keys = rawKey
      .split(",")
      .map(k => k.trim())
      .filter(Boolean);

    const headers = new Headers();

    for (const [name, value] of request.headers) {
      if (name.toLowerCase() === "content-type") {
        headers.set(name, value);
      }
    }

    if (!keys.length) {
      return fetch(targetUrl, {
        method: request.method,
        headers,
        body: request.body
      });
    }

    for (const key of keys) {
      headers.set("x-goog-api-key", key);

      const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: request.body
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
