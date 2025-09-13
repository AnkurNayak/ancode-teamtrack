import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  registerIcons(): void {
    this.matIconRegistry.addSvgIconSetInNamespace(
      'heroicons_outline',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'teamtrack_logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/logo.svg')
    );
  }
}
