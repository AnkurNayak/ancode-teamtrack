import {
  Injectable,
  OnDestroy,
  Component,
  ViewContainerRef,
  OnInit,
  ComponentRef,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DialogConfig {
  data?: any;
  mode?: string;
}
@Injectable({
  providedIn: 'root',
})
export class DialogService implements OnDestroy {
  private _isDialogOpen$ = new BehaviorSubject<boolean>(false);
  private _dialogContent$ = new BehaviorSubject<any>(null);

  private _dialogConfig$: BehaviorSubject<DialogConfig> = new BehaviorSubject<DialogConfig>({});

  ngOnDestroy(): void {
    this._isDialogOpen$.next(false);
    this._isDialogOpen$.complete();
    this._dialogContent$.complete();
    this._dialogConfig$.complete();
  }

  get isOpen$(): Observable<boolean> {
    return this._isDialogOpen$.asObservable();
  }

  get content$(): Observable<any> {
    return this._dialogContent$.asObservable();
  }

  get config$(): Observable<DialogConfig> {
    return this._dialogConfig$.asObservable();
  }

  get isOpen(): boolean {
    return this._isDialogOpen$.value;
  }

  openDialog(content: any, config: DialogConfig = {}): void {
    if (!content) return;
    this._dialogContent$.next(content);
    this._dialogConfig$.next(config);
    this._isDialogOpen$.next(true);
  }

  closeDialog(): void {
    this._isDialogOpen$.next(false);
    this._dialogContent$.next(null);
  }
}
