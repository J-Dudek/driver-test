import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {QuestionGroup} from '../models/question-group.model';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {

    private http = inject(HttpClient);

    loadQuestions(): Observable<QuestionGroup[]> {
        return this.http.get<QuestionGroup[]>(
            '/assets/data/questions.json'
        );
    }
}