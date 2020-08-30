import { Action } from '@ngrx/store';

import { Provider, Favorite } from '../shared/models/provider';
import { ProviderType } from '../shared/constants/provider';

export enum ActionTypes {
  GetProvider = '[Provider] Get provider',
  GetItems = '[Items] Request provider data',
  LoadItems = '[Items] Response provider data',
  GetFavorites = '[Favorites] Response provider data',
  AddToFavorites = '[Favorites] Add to favorites',
  RemoveFromFavorites = '[Favorites] Remove from favorites',
  AddComment = '[Comment] Add comment'
}

export class GetProvider implements Action {
  readonly type = ActionTypes.GetProvider;

  constructor(public payload: ProviderType) { }
}

export class GetItems implements Action {
  readonly type = ActionTypes.GetItems;

  constructor(public payload: ProviderType) { }
}

export class LoadItems implements Action {
  readonly type = ActionTypes.LoadItems;

  constructor(public payload: Array<Provider>) { }
}

export class AddToFavorites implements Action {
  readonly type = ActionTypes.AddToFavorites;

  constructor(public payload: Favorite) { }
}

export class RemoveFromFavorites implements Action {
  readonly type = ActionTypes.RemoveFromFavorites;

  constructor(public payload: Favorite['id']) { }
}

export class AddComment implements Action {
  readonly type = ActionTypes.AddComment;

  constructor(public payload: Provider) { }
}

export type Actions = GetProvider | GetItems | LoadItems | AddToFavorites | RemoveFromFavorites | AddComment;
