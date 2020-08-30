import { SortDirection } from '@angular/material/sort';

export enum SortType {
  asc = 'asc',
  desc = 'desc'
}

export enum ColumnType {
   text = 'text',
   checkbox = 'checkbox',
   comment = 'comment'
}

export interface Column {
  field: string;
  title: string;
  flex?: string;
  type?: ColumnType;
  sortable?: boolean;
  defaultSort?: boolean;
  direction?: SortDirection;
}

export interface SortConfig {
  sort?: string;
  direction?: SortDirection;
}
