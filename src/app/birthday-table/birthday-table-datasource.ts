import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';


export interface BirthdayTableItem {
  date:string;
  name: string;
}


const EXAMPLE_DATA: BirthdayTableItem[] = [
  {date:'26 August', name: 'Aiden'},
  {date:'26 August', name:'Benjamin'},
  {date:'26 August', name: 'Deniel'},
  {date:'26 August', name: 'Hanry'},
  {date:'28 August',  name: 'Jack'},
  {date:'28 August',  name: 'Peter'},
  {date:'28 August',  name: 'John'},
  {date:'28 August',  name: 'Harry'},
  {date:'29 August',  name: 'Evan'},
  {date:'29 August',  name: 'Robert'},
  {date:'29 August',  name: 'Chris'},
  {date:'30 August',  name: 'Robin'},
  {date:'30 August',  name: 'Anie'},
  {date:'30 August',  name: 'Moriss'},
  {date:'30 August',  name: 'Ron'},
  {date:'31 August',  name: 'Noah'},
  {date:'31 August',  name: 'Sam'},
  {date:'31 August',  name: 'Curran'},
  {date:'1 September', name: 'Kevin'},
  {date:'1 September', name: 'Smith'},
  
];

/**
 * Data source for the BirthdayTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class BirthdayTableDataSource extends DataSource<BirthdayTableItem> {
  data: BirthdayTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<BirthdayTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  disconnect(): void {}

  /**
   * Paginate the data (client-side).
   */
  private getPagedData(data: BirthdayTableItem[]): BirthdayTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side)
   */
  private getSortedData(data: BirthdayTableItem[]): BirthdayTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort */
function compare(a: string, b: string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
