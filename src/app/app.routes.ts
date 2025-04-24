import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PhoneFormComponent } from './pages/phone-form/phone-form.component';
import { PhoneManagementComponent } from './pages/phone-management/phone-management.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        component: HomeComponent,
        title: 'Gerencia Fone | Início',
      },
      {
        path: 'numeros-disponiveis',
        component: PhoneManagementComponent,
        title: 'Gerencia Fone | Números disponíveis',
      },
      {
        path: 'novo-numero',
        component: PhoneFormComponent,
        title: 'Gerencia Fone | Novo número',
      },
      {
        path: 'editar-numero/:id',
        component: PhoneFormComponent,
        title: 'Gerencia Fone | Editar número',
      },
    ],
  },
];
