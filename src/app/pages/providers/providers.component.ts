import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { of } from 'rxjs/internal/observable/of';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PROVIDERS_LABELS, ProviderType } from 'src/app/shared/constants/provider';
import { Column, SortType, ColumnType, SortConfig } from 'src/app/shared/components/data-table/data-table.types';
import { GetItems, AddToFavorites, RemoveFromFavorites, GetProvider, AddComment } from 'src/app/store/action';
import { Provider, Favorite } from 'src/app/shared/models/provider';
import { AppState } from 'src/app/store/reducer';

@Component({
  selector: 'stms-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProvidersComponent implements OnInit {
  private selectedProvider: BehaviorSubject<ProviderType> = new BehaviorSubject(null);
  providers$: Observable<Array<string>> = of(Object.keys(PROVIDERS_LABELS).map((key) => PROVIDERS_LABELS[key]));
  selectedProvider$: Observable<ProviderType> = this.store.pipe(
    select(({ root: { provider } }) => provider)
  );
  items$: Observable<Array<Provider>> = this.store.pipe(
    select(({ root: { items } }) => items)
  );
  favorites$: Observable<Array<Provider['id']>> = this.store.pipe(
    select(({ root: { favorites } }) => favorites.map(({ id }) => id))
  );
  loading$: Observable<boolean> = this.store.pipe(
    select(({ root: { loading } }) => loading)
  );
  columns$: Observable<Array<Column>> = of([]);

  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.selectedProvider$.subscribe((provider) => {
      this.initColumns(provider);
      this.selectedProvider.next(provider);
    });
  }

  handleSelectionChange = ({ value }: MatSelectChange) => {
    this.store.dispatch(new GetProvider(value));
    this.store.dispatch(new GetItems(value));
  }

  handleRowChecked = ({ checked, row }: { row: Provider, checked: boolean }) => {
    const favorite = this.mapFavorite(this.selectedProvider.value, row);
    const message = checked ? 'Added to favorites' : 'Removed from favorites';

    checked ? this.store.dispatch(new AddToFavorites(favorite)) : this.store.dispatch(new RemoveFromFavorites(favorite.id));

    this.snackBar.open(message, undefined, { duration: 2000 });
  }

  handleCommented = (event: Provider) => {
    this.store.dispatch(new AddComment(event));
    this.snackBar.open('Added a comment', undefined, { duration: 2000 });
  }

  handleSortChange = (event: SortConfig) => {
    // Here I should call api for sorting, but my chosen providers don't provide sorting capability
    console.log(event);
    this.store.dispatch(new GetItems(this.selectedProvider.value));
  }

  private initColumns = (providerType: ProviderType) => {
    switch (providerType) {
      case PROVIDERS_LABELS[ProviderType.movies]:
        this.columns$ = of([
          {
            field: 'select',
            title: '',
            type: ColumnType.checkbox,
            flex: '0 0 5%'
          },
          {
            field: 'id',
            title: 'ID'
          },
          {
            field: 'title',
            title: 'Title',
            sortable: true,
            defaultSort: true,
            direction: SortType.asc
          },
          {
            field: 'release_date',
            title: 'Release date',
            flex: '0 0 8%'
          },
          {
            field: 'comment',
            title: 'Comment',
            type: ColumnType.comment
          }
        ]);

        break;

      case PROVIDERS_LABELS[ProviderType.beer]:
        this.columns$ = of([
          {
            field: 'select',
            title: '',
            type: ColumnType.checkbox,
            flex: '0 0 5%'
          },
          {
            field: 'id',
            title: 'ID'
          },
          {
            field: 'name',
            title: 'Name',
            sortable: true,
            defaultSort: true,
            direction: SortType.asc
          },
          {
            field: 'first_brewed',
            title: 'First brewed',
            flex: '0 0 8%'
          },
          {
            field: 'comment',
            title: 'Comment',
            type: ColumnType.comment
          }
        ]);

        break;
    }
  }

  private mapFavorite = (providerType: ProviderType, row: Provider): Favorite => {
    switch (providerType) {
      case PROVIDERS_LABELS[ProviderType.movies]:
        return {
          id: row.id,
          name: row.title,
          date: row.release_date,
          comment: row.comment
        };

      case PROVIDERS_LABELS[ProviderType.beer]:
        return {
          id: row.id,
          name: row.name,
          date: row.first_brewed,
          comment: row.comment
        };
    }
  }
}
