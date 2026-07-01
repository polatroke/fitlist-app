import { Injectable } from '@angular/core';
import { Exercicio } from '../models/exercicio.model';

@Injectable({
  providedIn: 'root',
})
export class VideoLocal {
  private storageKey = 'exercicios';

  getAll(): Exercicio[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  saveAll(exercicios: Exercicio[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(exercicios));
  }

  add(exercicio: Exercicio): void {
    const exercicios = this.getAll();
    exercicios.push(exercicio);
    this.saveAll(exercicios);
  }

  getById(id: string): Exercicio | undefined {
    return this.getAll().find((exercicio) => exercicio.id === id);
  }

  update(updatedExercicio: Exercicio): void {
    const exercicios = this.getAll().map((exercicio) =>
      exercicio.id === updatedExercicio.id ? updatedExercicio : exercicio,
    );
    this.saveAll(exercicios);
  }

  delete(id: string): void {
    const exercicios = this.getAll().filter((exercicio) => exercicio.id !== id);
    this.saveAll(exercicios);
  }
}
