import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { Layout, Theme } from 'app/layout/layout.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { MediaQueryService } from './media-query.service';

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

  constructor(
    private _storageService: StorageService,
    @Inject(DOCUMENT) private _document: any,
    private _mediaQueryService: MediaQueryService
  ) {
    const storageTheme = this._storageService.getItem('theme');
    // console.log('theme', storageTheme);
    const initConfig: AppConfig = {
      ...this.defaultConfig,
      theme: storageTheme || 'dark',
      navigation: this._mediaQueryService.currentWidth >= 900,
    };
    // console.log('config', initConfig);
    this._config = new BehaviorSubject<AppConfig>(initConfig);
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
    this._storageService.setItem('theme', theme);
  }

  switchLayout(layout: Layout): void {
    this._config.next({ ...this._config.value, layout });
  }

  toggleNavigation(status: boolean): void {
    this._config.next({ ...this._config.value, navigation: status });
  }

  updateTheme() {
    const body = this._document.body;
    body.classList.remove('light', 'dark');
    body.classList.add(this.currentConfig.theme);
  }
}
