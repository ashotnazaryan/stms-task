import { Component } from '@angular/core';

@Component({
  selector: 'stms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  items = [
    {
      id: 1,
      name: 'Providers',
      route: 'providers'
    },
    {
      id: 2,
      name: 'Favorites',
      route: 'favorites'
    }]
    ;
  constructor() {

  }

  trackBy = (index: number, item: any) => {
    return item.id || index;
  }
}
