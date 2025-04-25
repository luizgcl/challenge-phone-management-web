import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
} from 'rxjs';
import { Link } from '../../models/paginator';
import { PhoneNumber } from '../../models/phone-number';
import { PhoneService } from '../../services/phone.service';
import { SharedModule } from '../../shared/shared.module';

export interface InfoMessage {
  action: 'edit' | 'create' | 'delete' | 'error';
  message: string;
}

@Component({
  selector: 'app-phone-management',
  standalone: true,
  imports: [RouterModule, SharedModule],
  providers: [AsyncPipe],
  templateUrl: './phone-management.component.html',
  styleUrl: './phone-management.component.css',
})
export class PhoneManagementComponent {
  phoneService = inject(PhoneService);
  asyncPipe = inject(AsyncPipe);
  router = inject(Router);

  info: InfoMessage | null = this.router.getCurrentNavigation()?.extras
    .info as InfoMessage | null;

  private searchTerm$ = new BehaviorSubject<string>('');
  private url$ = new BehaviorSubject<string>('');
  private page$ = new BehaviorSubject<number>(1);
  private refresh$ = new BehaviorSubject<number>(Date.now());

  phonePaginatorResponse$ = combineLatest([
    this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()),
    this.page$.pipe(distinctUntilChanged()),
    this.url$.pipe(distinctUntilChanged()),
    this.refresh$.pipe(distinctUntilChanged()),
  ]).pipe(
    switchMap(([search, page, url]) =>
      this.phoneService.getPhones({ search, page, perPage: 10 }, url)
    ),
    shareReplay(1)
  );

  phones$ = this.phonePaginatorResponse$.pipe(map((res) => res.data));

  setSearchTerm(term: string) {
    this.searchTerm$.next(term);
    this.url$.next('');
    this.page$.next(1);
  }

  changePage(page: Link, index: number) {
    if (!page.url || page.url == this.url$.value) return;

    const pageIndex =
      this.asyncPipe
        .transform(this.phonePaginatorResponse$)
        ?.links.findIndex((link) => link.url == page.url) ?? 1;

    this.page$.next(pageIndex);
    this.url$.next(page.url);
  }

  deletePhone(phone: PhoneNumber) {
    this.phoneService.deletePhone(phone.id).subscribe({
      next: () => {
        this.refresh$.next(Date.now());
        this.info = {
          action: 'delete',
          message: `Número ${phone.value} de telefone deletado com sucesso.`,
        };
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          this.info = {
            action: 'error',
            message: err.error.message,
          };
        } else {
          this.info = {
            action: 'error',
            message: 'Erro ao deletar número de telefone.',
          };
        }
      },
    });
  }
}
