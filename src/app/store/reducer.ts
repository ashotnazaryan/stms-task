import { ActionReducerMap } from '@ngrx/store';

import { Actions, ActionTypes } from './action';
import { Provider } from '../shared/models/provider';
import { Favorite } from '../shared/models/favorite';
import { ProviderType } from '../shared/constants/provider';

export interface AppState {
  root: ProviderState;
}

interface ProviderState {
  provider: ProviderType;
  items: Array<Provider>;
  favorites: Array<Favorite>;
  loading: boolean;
}

export const initialState: ProviderState = {
  provider: null,
  items: [],
  favorites: [],
  loading: false
};

const providerReducer = (state: ProviderState = initialState, action: Actions): ProviderState => {
  switch (action.type) {
    case ActionTypes.GetProvider:
      return {
        ...state,
        provider: action.payload
      };

    case ActionTypes.GetItems:
      return {
        ...state,
        loading: true
      };

    case ActionTypes.LoadItems:
      return {
        ...state,
        loading: false,
        items: [...action.payload]
      };

    case ActionTypes.AddToFavorites:
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };

    case ActionTypes.RemoveFromFavorites:
      return {
        ...state,
        favorites: [...state.favorites.filter(({ id }) => id !== action.payload)]
      };

    case ActionTypes.AddComment:
      return {
        ...state,
        favorites: state.favorites.map((item) => {
          return {
            ...item,
            comment: item.id === action.payload.id ? action.payload.comment : item.comment
          };
        })
      };

    default:
      return state;
  }
};

export const reducers: ActionReducerMap<AppState> = {
  root: providerReducer
};
