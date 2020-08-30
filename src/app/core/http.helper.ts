import { HttpParams } from '@angular/common/http';

export class HttpHelper {
  static parseParams(params: { [key: string]: any }): HttpParams {
    let submitParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      submitParams = submitParams.append(key, params[key]);
    });

    return submitParams;
  }
}
