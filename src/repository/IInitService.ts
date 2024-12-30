import { Observable } from "rxjs";
import { IAPIGatewayEvent } from "utransfer-ms-core/lib";
import { InitRequest } from "types/init_request";

export interface IInitService {
  compute(event: object): Observable<object>;
}
