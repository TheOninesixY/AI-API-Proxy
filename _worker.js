export default {
  async fetch(request) {
    const targetBaseUrl = "https://generativelanguage.googleapis.com";
    const url = new URL(request.url);

    let rawKeys = "";
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (pathParts.length > 0 && pathParts[0].includes(",")) {
      rawKeys = pathParts.shift();
      url.pathname = "/" + pathParts.join("/");
    } else if (url.searchParams.has("key") && url.searchParams.get("key").includes(",")) {
      rawKeys = url.searchParams.get("key");
    }

    const keys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);

    if (keys.length > 0) {
      const selectedKey = keys[Math.floor(Math.random() * keys.length)];
      if (url.searchParams.has("key")) {
        url.searchParams.set("key", selectedKey);
      } else {
        url.searchParams.append("key", selectedKey);
      }
    }

    return fetch(new Request(`${targetBaseUrl}${url.pathname}${url.search}`, request));
  }
};
