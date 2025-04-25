import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
} from 'rxjs';
import { PhoneService } from '../../services/phone.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-phone-management',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './phone-management.component.html',
  styleUrl: './phone-management.component.css',
})
export class PhoneManagementComponent {
  phoneService = inject(PhoneService);

  private searchTerm$ = new BehaviorSubject<string>('');
  private page$ = new BehaviorSubject<number>(1);

  phonePaginatorResponse$ = combineLatest([
    this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()),
    this.page$,
  ]).pipe(
    switchMap(([search, page]) =>
      this.phoneService.getPhones({ search, page, perPage: 10 })
    ),
    shareReplay(1)
  );

  phones$ = this.phonePaginatorResponse$.pipe(map((res) => res.data));

  setSearchTerm(term: string) {
    this.searchTerm$.next(term);
  }

  setPage(page: number) {
    this.page$.next(page);
  }
}
