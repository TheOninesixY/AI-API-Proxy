const TARGET = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const keys = (url.searchParams.get("key") || request.headers.get("x-goog-api-key") || "")
      .split(",")
      .map(key => key.trim())
      .filter(Boolean);

    if (!keys.length) {
      return fetch(new Request(`${TARGET}${url.pathname}${url.search}`, request));
    }

    const requests = keys.map(key => {
      const targetUrl = new URL(`${TARGET}${url.pathname}${url.search}`);
      targetUrl.searchParams.set("key", key);

      const headers = new Headers(request.headers);
      headers.delete("x-goog-api-key");

      return new Request(targetUrl, {
        method: request.method,
        headers,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        redirect: request.redirect
      });
    });

    for (const req of requests) {
      const response = await fetch(req);

      if (response.status !== 429) {
        return response;
      }

      if (req !== requests[requests.length - 1]) {
        continue;
      }

      return response;
    }

    return new Response(null, { status: 500 });
  }
};
