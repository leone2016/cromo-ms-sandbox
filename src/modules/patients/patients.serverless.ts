export default {
  handler: "src/patients.handler",
  events: [
    {
      http: {
        method: "get",
        path: "patients/health",
        cors: true,
      },
    },
  ],
};
