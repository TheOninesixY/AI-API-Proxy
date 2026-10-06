const TARGET = "https://generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const clientUrl = new URL(request.url);
    const headerKey = request.headers.get("x-goog-api-key");
    const queryKey = clientUrl.searchParams.get("key");
    const rawKeys = headerKey || queryKey || "";

    const keys = rawKeys
      .split(",")
      .map(key => key.trim())
      .filter(Boolean);

    if (keys.length === 0) {
      return new Response("Missing API key", { status: 401 });
    }

    for (const key of keys) {
      const targetUrl = new URL(TARGET);
      targetUrl.pathname = clientUrl.pathname;

      clientUrl.searchParams.forEach((value, name) => {
        if (name !== "key") {
          targetUrl.searchParams.append(name, value);
        }
      });

      targetUrl.searchParams.set("key", key);

      const headers = new Headers(request.headers);
      headers.delete("x-goog-api-key");

      const response = await fetch(
        new Request(targetUrl, {
          method: request.method,
          headers,
          body: ["GET", "HEAD"].includes(request.method)
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
