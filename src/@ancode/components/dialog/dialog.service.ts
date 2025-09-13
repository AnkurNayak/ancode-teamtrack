import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService implements OnDestroy {
  private _isDialogOpen$ = new BehaviorSubject<boolean>(false);
  private _dialogContent$ = new BehaviorSubject<any>(null);

  ngOnDestroy(): void {
    this._isDialogOpen$.next(false);
    this._isDialogOpen$.complete();
    this._dialogContent$.complete();
  }

  get isOpen$(): Observable<boolean> {
    return this._isDialogOpen$.asObservable();
  }

  get content$(): Observable<any> {
    return this._dialogContent$.asObservable();
  }

  get isOpen(): boolean {
    return this._isDialogOpen$.value;
  }

  openDialog(content: any): void {
    if (!content) return;
    this._dialogContent$.next(content);
    this._isDialogOpen$.next(true);
  }

  closeDialog(): void {
    this._isDialogOpen$.next(false);
    this._dialogContent$.next(null);
  }
}
