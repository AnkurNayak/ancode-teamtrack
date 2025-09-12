import { LayoutConfigService, AppConfig } from '@ancode/services/common/config.service';
import { Component, DOCUMENT, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Layout } from 'app/layout/layout.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class LayoutComponent implements OnInit, OnDestroy {
  config: AppConfig;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _LayoutConfigService: LayoutConfigService,
    @Inject(DOCUMENT) private _document: any
  ) {
    this.config = this._LayoutConfigService.defaultConfig;
  }

  /* Lifecycle hooks */
  ngOnInit(): void {
    // Subscribe to config changes and initialize config
    this._LayoutConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: AppConfig) => {
        this.config = config;
        this._updateTheme();
      });
  }

  /* Update theme */
  private _updateTheme(): void {
    const body = this._document.body;
    body.classList.remove('light', 'dark');
    body.classList.add(this.config.theme);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
