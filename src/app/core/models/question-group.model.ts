import {Question} from './question.model';

export interface QuestionGroup {
    numero: number;
    questions: Question[];
}