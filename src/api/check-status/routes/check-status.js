module.exports = {
  routes: [
    {
      method: "POST",
      path: "/check-status",
      handler: "check-status.exampleAction",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
