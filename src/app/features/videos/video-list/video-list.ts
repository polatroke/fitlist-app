import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Exercicio } from '../../../core/models/exercicio.model';
import { VideoApi } from '../../../core/services/video-api';
import { ExercicioFilterPipe } from '../../../shared/pipes/exercicio-filter.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';

@Component({
  selector: 'app-video-list',
  imports: [RouterLink, CommonModule, FormsModule, ExercicioFilterPipe, HighlightDirective],
  templateUrl: './video-list.html',
  styleUrl: './video-list.css',
})
export class VideoList implements OnInit {
  private videoApiService = inject(VideoApi);
  private router = inject(Router);

  exercicios: Exercicio[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  dificuldadeFilter = '';

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.videoApiService.getAll().subscribe({
      next: (response) => {
        this.exercicios = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar exercícios:', error);
        this.errorMessage = 'Erro ao carregar os exercícios...';
        this.loading = false;
      },
    });
  }

  detail(id: string): void {
    this.router.navigate(['/videos', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/cadastrar-video'], {
      queryParams: { id },
    });
  }

  remove(id: string): void {
    const confirmDelete = confirm('Tem certeza que quer excluir?');

    if (!confirmDelete) {
      return;
    }

    this.videoApiService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Exercício excluído com sucesso!';
        this.loadVideos();
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
      },
      error: () => {
        this.errorMessage = 'Erro ao excluir o exercício.';
      },
    });
  }
}
