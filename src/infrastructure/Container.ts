/**
 *
 */
import {
  CONTAINER as CONT_CORE,
  IDENTIFIERS as ID_CORE,
  ILogger,
  UtransferErrors,
} from "utransfer-ms-core/lib";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IDENTIFIERS } from "constant/Identifiers";
import { ErrorCode, ERRORS } from "infrastructure/ErrorEnum";
import { Container, interfaces } from "inversify";
import { IInitService } from "repository/IInitService";
import { InitService } from "service/InitService";

const CONT_APP: Container = new Container();

// Core
CONT_APP.bind<UtransferErrors<ErrorCode>>(
  ID_CORE.UtransferErrors
).toConstantValue(ERRORS);

// Service
CONT_APP.bind<IInitService>(IDENTIFIERS.InitService).to(InitService);
// Gateway

// istanbul ignore next
CONT_APP.bind<DocumentClient>(IDENTIFIERS.AwsDocumentClient).toDynamicValue(
  () =>
    new DocumentClient({
      convertEmptyValues: true,
      logger: CONT_CORE.get<ILogger>(ID_CORE.Logger),
    })
);

const CONTAINER: interfaces.Container = Container.merge(CONT_CORE, CONT_APP);

export { CONTAINER };
