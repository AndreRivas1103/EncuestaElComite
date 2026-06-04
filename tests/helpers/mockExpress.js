export function createMockReq(overrides = {}) {
  return { body: {}, params: {}, query: {}, ...overrides };
}

export function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}
