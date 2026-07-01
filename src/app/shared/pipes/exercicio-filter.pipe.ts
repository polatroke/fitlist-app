import { Pipe, PipeTransform } from '@angular/core';
import { Exercicio } from '../../core/models/exercicio.model';

@Pipe({
    name: 'exercicioFilter',
    standalone: true,
})
export class ExercicioFilterPipe implements PipeTransform {
    transform(exercicios: Exercicio[] | null | undefined, searchTerm = '', dificuldade = ''): Exercicio[] {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const normalizedDificuldade = dificuldade.trim().toLowerCase();

        if (!exercicios) {
            return [];
        }

        return exercicios.filter((exercicio) => {
            const matchesSearch =
                !normalizedSearch ||
                `${exercicio.nome} ${exercicio.grupoMuscular} ${exercicio.dificuldade}`
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesDificuldade =
                !normalizedDificuldade ||
                exercicio.dificuldade.toLowerCase().includes(normalizedDificuldade);

            return matchesSearch && matchesDificuldade;
        });
    }
}
