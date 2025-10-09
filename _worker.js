export default {
  async fetch(request) {
    // ==================================================
    const targetBaseUrl = "https://api.openai.com";
    // ==================================================
    const { pathname, search } = new URL(request.url);
    return fetch(new Request(`${targetBaseUrl}${pathname}${search}`, request));
  },
};
