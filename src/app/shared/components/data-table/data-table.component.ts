import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormGroup, FormBuilder } from '@angular/forms';

import { isEmptyObject } from 'src/app/shared/utils/common';
import { Column, ColumnType, SortConfig, SortType } from './data-table.types';
import { Provider } from 'src/app/shared/models/provider';

@Component({
  selector: 'stms-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() loading: boolean;
  @Input() columns: Array<Column> = [];
  @Input() data: Array<Provider> = [];
  @Input() checkedRows: Array<string> = [];

  @Output() sortChanged = new EventEmitter<SortConfig>();
  @Output() rowChecked = new EventEmitter<{ row: Provider, checked: boolean }>();
  @Output() commented = new EventEmitter<Provider>();

  form: FormGroup;
  displayedColumns: Array<string>;
  ColumnType = ColumnType;
  sortConfig: SortConfig = {
    sort: 'name',
    direction: SortType.asc,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const shouldCreateFormControls =
      this.data.length > 0 && this.columns.some(({ type }) => type === ColumnType.comment
        && (changes.data && changes.data.currentValue?.length !== changes.data.previousValue?.length)
        || (this.form && isEmptyObject(this.form.controls)));
    const shouldInitializeTable = this.columns.length > 0;

    if (shouldCreateFormControls) {
      this.initializeFormControls();
    }

    if (shouldInitializeTable) {
      this.displayedColumns = (this.columns || []).map(({ field }) => field);
    }
  }

  hadleSortChange = (event: Sort) => {
    this.sortConfig = {
      ...this.sortConfig,
      sort: event.active,
      direction: event.direction
    };

    this.setQueryParams();
    this.sortChanged.emit(this.sortConfig);
  }

  handleCheckboxChange = ({ checked }: MatCheckboxChange, row: Provider) => {
    this.rowChecked.emit({ row, checked });
  }

  addComment = (row: Provider) => {
    this.commented.emit({ ...row, comment: this.form.value[row.id] });
  }

  trackBy = (index: number, item: Provider) => {
    return item.id || index;
  }

  private setQueryParams = () => {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.sortConfig,
      queryParamsHandling: 'merge',
    });
  }

  private initialize = () => {
    const queryParams = { ...this.route.snapshot.queryParams };

    if (isEmptyObject(queryParams)) {
      const { direction, field } = (this.columns || []).find(({ defaultSort }) => defaultSort)
        || { direction: this.sortConfig.direction, field: this.sortConfig.sort };

      this.sortConfig = {
        ...this.sortConfig,
        direction,
        sort: field
      };

      this.setQueryParams();
    } else {
      this.sortConfig = {
        ...this.sortConfig,
        ...queryParams,
      };
    }
  }

  private initializeFormControls = () => {
    const formFileds = this.data.reduce((acc, item) => {
      return {
        ...acc,
        [item.id]: ''
      };
    }, {});

    this.form = this.formBuilder.group(formFileds);
  }
}
