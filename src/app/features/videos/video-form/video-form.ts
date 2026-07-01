import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoApi } from '../../../core/services/video-api';

@Component({
  selector: 'app-video-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './video-form.html',
  styleUrl: './video-form.css',
})
export class VideoForm implements OnInit {
  private fb = inject(FormBuilder);
  private videoApiService = inject(VideoApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  editingId: string | null = null;
  loading = false;
  loadingData = false;
  successMessage = '';
  errorMessage = '';

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    grupoMuscular: ['', [Validators.required]],
    dificuldade: ['', [Validators.required]],
    duracaoMedia: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.editingId = id;
      this.loadVideo(this.editingId);
    }
  }

  loadVideo(id: string): void {
    this.loadingData = true;
    this.videoApiService.getById(id).subscribe({
      next: (exercicio) => {
        this.form.patchValue({
          nome: exercicio.nome,
          grupoMuscular: exercicio.grupoMuscular,
          dificuldade: exercicio.dificuldade,
          duracaoMedia: exercicio.duracaoMedia,
        });
        this.loadingData = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar os dados do exercício.';
        this.loadingData = false;
      },
    });
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.getRawValue();

    const exercicioData = {
      nome: formValue.nome,
      grupoMuscular: formValue.grupoMuscular,
      dificuldade: formValue.dificuldade,
      duracaoMedia: formValue.duracaoMedia,
    };

    if (this.editingId !== null) {
      this.videoApiService.update(this.editingId, exercicioData).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Exercício atualizado com sucesso!';
          setTimeout(() => {
            this.router.navigate(['/videos']);
          }, 1000);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Erro ao atualizar o exercício.';
        },
      });
      return;
    }
    this.videoApiService.create(exercicioData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Exercício cadastrado com sucesso!';
        this.form.reset();

        setTimeout(() => {
          this.router.navigate(['/videos']);
        }, 1000);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erro ao cadastrar exercício.';
      },
    });
  }
}
