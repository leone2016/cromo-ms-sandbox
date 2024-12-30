import { IInitService } from "repository/IInitService";
import { injectable } from "inversify";
import { IAPIGatewayEvent } from "utransfer-ms-core/lib";
import { InitRequest } from "types/init_request";
import { Observable, of } from "rxjs";

@injectable()
export class InitService implements IInitService {
  public compute(event: object): Observable<object> {
    return of({ test: "HOLA MUNDO" });
  }
}
