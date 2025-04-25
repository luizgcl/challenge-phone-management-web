import { AsyncPipe } from '@angular/common';
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
import { PhoneService } from '../../services/phone.service';
import { SharedModule } from '../../shared/shared.module';

export interface InfoMessage {
  action: 'edit' | 'create';
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

  phonePaginatorResponse$ = combineLatest([
    this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()),
    this.page$.pipe(distinctUntilChanged()),
    this.url$.pipe(distinctUntilChanged()),
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
}
