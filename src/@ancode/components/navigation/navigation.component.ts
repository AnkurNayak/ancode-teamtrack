import { LayoutConfigService } from '@ancode/services/common/config.service';
import { MediaQueryService } from '@ancode/services/common/media-query.service';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostBinding,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: false,
})
export class NavigationComponent implements OnInit, OnDestroy {
  @Input() opened: boolean = true;
  @Input() isSmDevice: boolean = false;
  private _overlay!: HTMLElement;
  private readonly _handleOverlayClick: any;
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private _mediaQueryService: MediaQueryService,
    private _layoutConfigService: LayoutConfigService,
    private _elementRef: ElementRef,
    private _renderer2: Renderer2
  ) {
    this._handleOverlayClick = (): void => {
      this._layoutConfigService.toggleNavigation(false);
    };
  }

  /**
   * Host binding for component classes
   */
  @HostBinding('class') get classList(): any {
    return {
      'navigation-animations-enabled': true,
      'navigation-opened': this.opened,
      'navigation-closed': !this.opened,
      'navigation-sm': this.isSmDevice,
    };
  }

  ngOnInit(): void {
    this._mediaQueryService.windowWidth$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((width: number) => {
        const isSmallDevice = this.isSmDevice;
        this.isSmDevice = width <= 960;

        // Nav open while resizing screens : or default state.
        if (isSmallDevice !== this.isSmDevice) {
          this._layoutConfigService.toggleNavigation(!this.isSmDevice);
        }

        this._updateOverlay();
      });

    /* Subscription nav open close */
    this._layoutConfigService.config$.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
      this.opened = config.navigation;
      this._updateOverlay();
    });
  }

  ngOnDestroy(): void {
    this._removeOverlay();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /* functions */
  /**
   * Update overlay based on navigation state and device width
   * @private
   */

  onLinkClick(): void {
    if (this.isSmDevice) {
      this._layoutConfigService.toggleNavigation(false);
    }
  }
  private _updateOverlay(): void {
    // For small devices, display overlay if navigation is opened
    if (this.isSmDevice && this.opened) {
      this._displayOverlay();
    } else {
      this._removeOverlay();
    }
  }

  /**
   * Show overlay
   * @private
   */
  private _displayOverlay(): void {
    if (this._overlay) return;
    // Create overlay div
    this._overlay = this._renderer2.createElement('div');
    // add overlay class
    this._overlay.classList.add('navigation-overlay');
    this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._overlay);
    // close navigation on click
    this._overlay.addEventListener('click', this._handleOverlayClick);
  }

  private _removeOverlay(): void {
    if (!this._overlay) return;
    this._overlay.parentNode?.removeChild(this._overlay);
    this._overlay.removeEventListener('click', this._handleOverlayClick);
    this._overlay = null as any;
  }
}
