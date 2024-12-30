/**
 *
 */
import { UtransferErrors, StatusCodeEnum } from "utransfer-ms-core/lib";

export enum ErrorCode {
  E001 = "E001",
  E002 = "E002",
  E005 = "005",
  E006 = "006",
  E009 = "E009",
  E017 = "017",
  E018 = "018",
  E205 = "205",
  E207 = "207",
  E220 = "220",
  E577 = "577",
  E578 = "578",
  E579 = "579",
  E597 = "597",
  E228 = "228",
  E322 = "322",
  EU322 = "U322",
}

const ERROR_REJECTED_TRANSACTION: string = "Transacción Rechazada";

export const ERRORS: UtransferErrors<ErrorCode> = {
  [ErrorCode.E001]: {
    code: ErrorCode.E001,
    message: "Cuerpo de la petición inválido.",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E002]: {
    code: ErrorCode.E002,
    message: "Ha ocurrido un error inesperado.",
    statusCode: StatusCodeEnum.InternalServerError,
  },
  [ErrorCode.E005]: {
    code: ErrorCode.E005,
    message: "Número de cuenta no válido",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E006]: {
    code: ErrorCode.E006,
    message: ERROR_REJECTED_TRANSACTION,
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E009]: {
    code: ErrorCode.E009,
    message: "Ha ocurrido un error en el Gateway.",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E017]: {
    code: ErrorCode.E017,
    message: "Tarjeta no válida",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E018]: {
    code: ErrorCode.E018,
    message: "Tarjeta vencida",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E205]: {
    code: ErrorCode.E205,
    message: "Tipo de moneda no válida",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E207]: {
    code: ErrorCode.E207,
    message: "ID de transacción no válido",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E220]: {
    code: ErrorCode.E220,
    message:
      "Monto de la transacción es diferente al monto de la venta inicial",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E577]: {
    code: ErrorCode.E577,
    message: "El token de la transacción no es válido",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E578]: {
    code: ErrorCode.E578,
    message: "El token de la transacción ha expirado",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E579]: {
    code: ErrorCode.E579,
    message: ERROR_REJECTED_TRANSACTION,
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E597]: {
    code: ErrorCode.E597,
    message: "No hay respuesta del procesador",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E228]: {
    code: ErrorCode.E228,
    message: "Procesador inalcanzable",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.E322]: {
    code: ErrorCode.E322,
    message: "Transacción no permitida",
    statusCode: StatusCodeEnum.BadRequest,
  },
  [ErrorCode.EU322]: {
    code: ErrorCode.EU322,
    message: ERROR_REJECTED_TRANSACTION,
    statusCode: StatusCodeEnum.BadRequest,
  },
};
