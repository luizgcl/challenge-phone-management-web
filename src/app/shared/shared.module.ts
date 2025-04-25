import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  declarations: [LogoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
  ],
  exports: [
    LogoComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
  ],
})
export class SharedModule {}
