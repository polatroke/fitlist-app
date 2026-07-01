import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Exercicio } from '../../../core/models/exercicio.model';
import { VideoApi } from '../../../core/services/video-api';

@Component({
  selector: 'app-video-detail',
  imports: [RouterLink],
  templateUrl: './video-detail.html',
  styleUrl: './video-detail.css',
})
export class VideoDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private videoApiService = inject(VideoApi);

  exercicio?: Exercicio;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Exercício não encontrado';
      this.loading = false;
      return;
    }

    this.videoApiService.getById(id).subscribe({
      next: (response) => {
        this.exercicio = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar detalhes do exercício';
        this.loading = false;
      },
    });
  }
}
