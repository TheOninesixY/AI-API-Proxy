const TARGET = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const rawKey =
      request.headers.get("x-goog-api-key") ||
      url.searchParams.get("key") ||
      "";

    const keys = rawKey
      .split(",")
      .map(k => k.trim())
      .filter(Boolean);

    if (!keys.length) {
      return fetch(
        TARGET + url.pathname + url.search,
        request
      );
    }

    for (const key of keys) {
      const target = new URL(
        TARGET + url.pathname + url.search
      );

      target.searchParams.set("key", key);

      const headers = new Headers(request.headers);
      headers.delete("x-goog-api-key");

      const response = await fetch(
        new Request(target, {
          ...request,
          headers
        })
      );

      if (response.status !== 429 && response.status !== 503) {
        return response;
      }

      if (key === keys[keys.length - 1]) {
        return response;
      }
    }
  }
};
