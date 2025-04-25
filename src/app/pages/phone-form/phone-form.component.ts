import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PhoneService } from '../../services/phone.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-phone-form',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './phone-form.component.html',
  styleUrl: './phone-form.component.css',
})
export class PhoneFormComponent {
  formBuilder = inject(NonNullableFormBuilder);
  phoneService = inject(PhoneService);
  router = inject(Router);

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

    this.phoneService.createPhone(payload).subscribe({
      next: () => {
        this.router.navigate(['numeros-disponiveis'], {
          info: `Número ${payload.value} criado com sucesso`,
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
