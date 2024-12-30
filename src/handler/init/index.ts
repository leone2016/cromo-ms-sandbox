/* tslint:disable*/
import { getPathHandler } from "utransfer-ms-core/lib";

export default {
  handler: `${getPathHandler(__dirname)}/InitHandler.HANDLER`,
  events: [
    {
      http: {
        method: "get",
        path: "health",
      },
    },
  ],
};
