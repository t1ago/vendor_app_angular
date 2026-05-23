import { IPersonModel } from './person.model';

export type PersonSex = 'F' | 'M';

export interface INaturalPerson extends IPersonModel {
    sex: PersonSex;
    birthDate: string;
}
