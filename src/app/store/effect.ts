
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

import { ActionTypes, LoadItems } from './action';
import { ProvidersService } from '../shared/services/providers.service';
import { ProviderType, PROVIDERS_LABELS } from '../shared/constants/provider';
import { AppState } from './reducer';

@Injectable()
export class ProviderEffects {
  @Effect()
  loadItems$ = this.actions$.pipe(
    ofType(ActionTypes.GetItems),
    withLatestFrom(this.store.select(({ root: { provider } }) => provider)),
    map(([provider]) => provider as any),
    switchMap((provider) => {
      const providers = Object.keys(PROVIDERS_LABELS).map((key) => {
        return {
          key: key as ProviderType,
          value: PROVIDERS_LABELS[key]
        };
      });
      const currentProvider = providers.find((item) => item.value === provider.payload);

      return this.providersService.getProviderData(currentProvider.key).pipe(
        map((data) => new LoadItems(data)),
        catchError(() => of([]))
      );
    }));

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private providersService: ProvidersService
  ) { }
}
