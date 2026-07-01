import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Exercicio } from '../models/exercicio.model';

type FirebaseExercicio = Omit<Exercicio, 'id'> & { id?: unknown };

@Injectable({
  providedIn: 'root',
})
export class VideoApi {
  private http = inject(HttpClient);
  // private apiUrl = 'http://localhost:3000/exercicios';
  private apiUrl = 'https://exvideos-e4a93-default-rtdb.firebaseio.com/exercicios';
  private sufix = '.json';

  getAll(): Observable<Exercicio[]> {
    return this.http.get<Record<string, FirebaseExercicio> | null>(this.apiUrl + this.sufix).pipe(
      map((response) => {
        if (!response) {
          return [];
        }

        return Object.entries(response).map(([id, exercicio]) => {
          const { id: _ignoredId, ...exercicioData } = exercicio;

          return {
            id,
            ...exercicioData,
          };
        });
      }),
    );
  }

  getById(id: string): Observable<Exercicio> {
    return this.http.get<FirebaseExercicio | null>(`${this.apiUrl}/${id}${this.sufix}`).pipe(
      map((exercicio) => {
        if (!exercicio) {
          throw new Error('Exercício não encontrado');
        }

        const { id: _ignoredId, ...exercicioData } = exercicio;

        return {
          id,
          ...exercicioData,
        };
      }),
    );
  }

  create(exercicio: Omit<Exercicio, 'id'>): Observable<Exercicio> {
    return this.http.post<{ name: string }>(this.apiUrl + this.sufix, exercicio).pipe(
      map((response) => ({
        id: response.name,
        ...exercicio,
      })),
    );
  }

  update(id: string, exercicio: Omit<Exercicio, 'id'>): Observable<Exercicio> {
    return this.http.put<Omit<Exercicio, 'id'>>(`${this.apiUrl}/${id}${this.sufix}`, exercicio).pipe(
      map((response) => ({
        id,
        ...response,
      })),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}${this.sufix}`);
  }
}
