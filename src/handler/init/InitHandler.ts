import * as middy from "middy";
import {
  BUILDER_API_GATEWAY_MIDDLEWARE,
  ContentTypeEnum,
  ERROR_API_MIDDLEWARE,
  IAPIGatewayEvent,
  IDENTIFIERS as ID,
  IHandler,
  INPUT_OUTPUT_LOGS,
  IRollbar,
  SETUP_MIDDLEWARE,
  StatusCodeEnum,
  VALIDATION_MIDDLEWARE,
} from "utransfer-ms-core/lib";
import { InitRequest } from "types/init_request";
import { Handler } from "aws-lambda";
import { CONTAINER } from "infrastructure/Container";
import { IInitService } from "repository/IInitService";
import { IDENTIFIERS } from "constant/Identifiers";
import { SchemaEnum } from "infrastructure/SchemaEnum";

const CORE: IHandler = CONTAINER.get<IHandler>(ID.Handler);
const ROLLBAR = CONTAINER.get<IRollbar>(ID.Rollbar).init();

const HANDLER = middy(
    ROLLBAR.lambdaHandler(
        CORE.run<IInitService, object>(
            IDENTIFIERS.InitService,
            "compute",
            CONTAINER,
            ROLLBAR
        )
    )
)
    .use(SETUP_MIDDLEWARE(ROLLBAR))
    .use(INPUT_OUTPUT_LOGS(ROLLBAR))
    .use(ERROR_API_MIDDLEWARE(ROLLBAR))
    .use(
        BUILDER_API_GATEWAY_MIDDLEWARE(
            ROLLBAR,
            ContentTypeEnum.JSON,
            StatusCodeEnum.Created,
            ContentTypeEnum.JSON,
            false
        )
    );

export { HANDLER };