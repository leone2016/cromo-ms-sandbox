export default {
  handler: "src/evaluation.handler",
  events: [
    {
      http: {
        method: "get",
        path: "evaluation/health",
        cors: true,
      },
    },
  ],
};
