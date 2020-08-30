import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProviderType } from 'src/app/shared/constants/provider';
import { HttpHelper } from 'src/app/core/http.helper';
import { Provider } from '../models/provider';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  constructor(
    private http: HttpClient,
  ) {

  }

  getProviderData = (providerType: ProviderType, params: { [key: string]: any } = {}): Observable<Array<Provider>> => {
    const url = this.getUrl(providerType);
    const parsedParams = HttpHelper.parseParams(params);

    return this.http.get<Array<Provider>>(url, { params: parsedParams });
  }

  private getUrl = (providerType: ProviderType) => {
    switch (providerType) {
      case ProviderType.movies:
        return 'https://ghibliapi.herokuapp.com/films';

      case ProviderType.beer:
        return 'https://api.punkapi.com/v2/beers';

      default:
        break;
    }
  }
}
