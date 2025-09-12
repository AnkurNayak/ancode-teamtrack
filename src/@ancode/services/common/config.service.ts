import { Injectable } from '@angular/core';
import { Layout, Theme } from 'app/layout/layout.types';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppConfig {
  layout: Layout;
  theme: Theme;
  navigation: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutConfigService {
  private _config: BehaviorSubject<AppConfig>;
  public readonly defaultConfig: AppConfig = {
    layout: 'classic',
    theme: 'light',
    navigation: false,
  };

  constructor() {
    this._config = new BehaviorSubject<AppConfig>(this.defaultConfig);
  }

  get config$(): Observable<AppConfig> {
    return this._config.asObservable();
  }

  get currentConfig(): AppConfig {
    return this._config.value;
  }

  switchTheme(theme: Theme): void {
    this._config.next({
      ...this._config.value,
      theme,
    });
  }

  switchLayout(layout: Layout): void {
    this._config.next({ ...this._config.value, layout });
  }

  toggleNavigation(status: boolean): void {
    this._config.next({ ...this._config.value, navigation: status });
  }
}
