import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  currentYear = new Date().getFullYear();
  isMobileMenuOpen = signal(false);
  submitStatus = signal<SubmitStatus>('idle');

  contactForm = this.fb.group({
    name: ['', Validators.required],
    company: ['', Validators.required],
    whatsapp: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    city: [''],
    type: ['Loja de Rua'],
    message: [''],
  });

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  submitContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitStatus.set('sending');

    this.http.post('/api/contact', this.contactForm.value).subscribe({
      next: () => {
        this.submitStatus.set('success');
        this.contactForm.reset({type: 'Loja de Rua'});
      },
      error: () => {
        this.submitStatus.set('error');
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
