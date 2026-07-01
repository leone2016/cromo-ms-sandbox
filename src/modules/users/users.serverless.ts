export default {
  handler: "src/users.handler",
  events: [
    {
      http: {
        method: "get",
        path: "users/health",
        cors: true,
      },
    },
    {
      http: {
        method: "post",
        path: "users",
        cors: true,
      },
    },
  ],
};
