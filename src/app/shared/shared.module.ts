import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BrowserModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, BrowserModule],
})
export class SharedModule {}
