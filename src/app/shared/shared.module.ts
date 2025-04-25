import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  declarations: [LogoComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  exports: [LogoComponent, FormsModule, ReactiveFormsModule, AsyncPipe],
})
export class SharedModule {}
