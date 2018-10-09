import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../app.model';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public invert = false;
  public quoteOpened = false;
  public mobileMenu = false;
  public scrollingDown: boolean;
  public scrollPosition: number;

  constructor(private http: HttpClient) {}

  private _url = 'assets/menu.json';

  getMenu(): Observable<Menu> {
    return this.http.get<Menu>(this._url);
  }

  getSubMenu() {
    return this.http.get<Menu>(this._url);
  }

  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
  }
}
