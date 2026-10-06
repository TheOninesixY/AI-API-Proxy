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
      return new Response("Missing API key", { status: 401 });
    }

    for (const key of keys) {
      const targetUrl = new URL(TARGET);

      targetUrl.pathname = clientUrl.pathname;

      for (const [name, value] of clientUrl.searchParams) {
        if (name !== "key") {
          targetUrl.searchParams.append(name, value);
        }
      }

      targetUrl.searchParams.set("key", key);

      const headers = new Headers();

      for (const name of [
        "accept",
        "content-type",
        "x-goog-api-client"
      ]) {
        const value = request.headers.get(name);
        if (value) {
          headers.set(name, value);
        }
      }

      const response = await fetch(
        new Request(targetUrl, {
          method: request.method,
          headers,
          body:
            request.method === "GET" || request.method === "HEAD"
              ? undefined
              : request.body
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
