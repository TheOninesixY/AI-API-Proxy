export default {
  async fetch(request) {
    // ==================================================
    const targetBaseUrl = "https://ai.oninesixy.pages.dev";
    // ==================================================
    const { pathname, search } = new URL(request.url);
    return fetch(new Request(`${targetBaseUrl}${pathname}${search}`, request));
  },
};
