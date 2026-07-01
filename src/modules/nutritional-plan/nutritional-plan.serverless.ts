export default {
  handler: "src/nutritional-plan.handler",
  events: [
    {
      http: {
        method: "get",
        path: "nutritional-plan/health",
        cors: true,
      },
    },
  ],
};
