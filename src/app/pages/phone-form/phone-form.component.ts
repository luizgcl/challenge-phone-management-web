import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PhoneService } from '../../services/phone.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-phone-form',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './phone-form.component.html',
  styleUrl: './phone-form.component.css',
})
export class PhoneFormComponent implements OnInit {
  formBuilder = inject(NonNullableFormBuilder);
  phoneService = inject(PhoneService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  phoneId: number | null = null;

  errorMessage: string | null = null;

  phoneForm = this.formBuilder.group({
    value: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
        ),
      ],
    ],
    monthlyPrice: [0, [Validators.required]],
    setupPrice: [0, Validators.required],
    currency: ['BRL', Validators.required],
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.hasOwnProperty('id')) {
        this.phoneService.getPhone(params['id']).subscribe({
          next: (phone) => {
            this.phoneId = phone.id;
            this.phoneForm.patchValue({
              value: phone.value,
              monthlyPrice: phone.monthlyPrice,
              setupPrice: phone.setupPrice,
              currency: phone.currency,
            });
          },
          error: (err) => {
            if (err instanceof HttpErrorResponse) {
              this.errorMessage = err.error.message;
            } else {
              this.errorMessage = 'Ocorreu um erro ao buscar número!';
            }
          },
        });
      }
    });
  }

  onSubmit() {
    if (this.phoneForm.invalid) {
      return;
    }

    const payload = {
      value: this.phoneForm.value.value!,
      monthlyPrice: this.phoneForm.value.monthlyPrice!,
      setupPrice: this.phoneForm.value.setupPrice!,
      currency: this.phoneForm.value.currency!,
    };

    if (this.phoneId) {
      this.phoneService.updatePhone(this.phoneId, payload).subscribe({
        next: () => {
          this.router.navigate(['numeros-disponiveis'], {
            info: {
              action: 'edit',
              message: `Número ${payload.value} editado com sucesso`,
            },
          });
          this.phoneForm.reset();
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Ocorreu um erro ao editar número!';
          }
        },
      });

      return;
    }

    this.phoneService.createPhone(payload).subscribe({
      next: () => {
        this.router.navigate(['numeros-disponiveis'], {
          info: {
            action: 'create',
            message: `Número ${payload.value} criado com sucesso`,
          },
        });
        this.phoneForm.reset();
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Ocorreu um erro ao criar número!';
        }
      },
    });
  }
}
