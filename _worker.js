```javascript
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

    const targetUrl = new URL(
      TARGET + url.pathname + url.search
    );

    const headers = new Headers(request.headers);

    if (!keys.length) {
      return fetch(new Request(targetUrl, request), {
        cache: "no-store"
      });
    }

    headers.delete("x-goog-api-key");
    targetUrl.searchParams.delete("key");

    for (let i = 0; i < keys.length; i++) {
      headers.set("x-goog-api-key", keys[i]);

      const response = await fetch(
        new Request(targetUrl, {
          method: request.method,
          headers,
          body: request.body,
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
```
