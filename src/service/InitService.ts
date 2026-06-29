import { IInitService } from "repository/IInitService";
import { injectable } from "inversify";
import { IAPIGatewayEvent } from "utransfer-ms-core/lib";
import { InitRequest } from "types/init_request";
import { Observable, of } from "rxjs";

@injectable()
export class InitService implements IInitService {
  public compute(event: IAPIGatewayEvent<InitRequest>): Observable<object> {
    const { n1, n2 } = event.body;
    return of({
      n1,
      n2,
      result: n1 + n2,
      test: "HOLA MUNDO",
    });
  }
}
