export default {
  async fetch(request) {
    // ==================================================
    const targetBaseUrl = "https://cqpylunmqphl.ap-southeast-1.clawcloudrun.com";
    // ==================================================
    const { pathname, search } = new URL(request.url);
    return fetch(new Request(`${targetBaseUrl}${pathname}${search}`, request));
  },
};
