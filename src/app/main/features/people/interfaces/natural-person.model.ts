import { IPeopleModel } from './people.model';

export type PeopleSex = 'F' | 'M';

export interface INaturalPerson extends IPeopleModel {
    sex: PeopleSex;
    birthDate: string;
}
