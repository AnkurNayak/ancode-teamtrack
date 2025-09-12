import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private windowWidthSubject = new BehaviorSubject<number>(0);
  public windowWidth$ = this.windowWidthSubject.asObservable();

  constructor() {
    this.checkScreenSize();
    if (typeof window !== 'undefined') {
      fromEvent(window, 'resize')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.checkScreenSize());
    }
  }

  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const currentWidth = window.innerWidth;
      this.windowWidthSubject.next(currentWidth);
    }
  }

  get currentWidth(): number {
    return this.windowWidthSubject.value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
