import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Store, select } from '@ngrx/store';

import { Favorite } from 'src/app/shared/models/favorite';
import { AppState } from 'src/app/store/reducer';
import { Column, SortType } from 'src/app/shared/components/data-table/data-table.types';

@Component({
  selector: 'stms-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  columns$: Observable<Array<Column>> = of([
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
      field: 'date',
      title: 'Date',
      flex: '0 0 8%'
    },
    {
      field: 'comment',
      title: 'Comment'
    }
  ]);
  favorites$: Observable<Array<Favorite>> = this.store.pipe(
    select(({ root: { favorites } }) => favorites)
  );
  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

  }
}
