import { LayoutConfigService } from '@ancode/services/common/config.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Theme } from 'app/layout/layout.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  theme: 'dark' | 'light' = 'dark';

  private _unsubscribeAll: Subject<void> = new Subject<void>();
  /* Constructor */
  constructor(private _LayoutConfigService: LayoutConfigService) {}

  ngOnInit(): void {
    this._LayoutConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ theme }) => (this.theme = theme));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  switchTheme(theme: Theme): void {
    this._LayoutConfigService.switchTheme(theme);
  }

  toggleSidenav(): void {
    this._LayoutConfigService.toggleNavigation(!this._LayoutConfigService.currentConfig.navigation);
  }
}
