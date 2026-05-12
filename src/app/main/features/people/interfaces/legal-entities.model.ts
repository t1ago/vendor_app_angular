import { INaturalPerson } from './natural-person.model';
import { IPeopleModel } from './people.model';

export interface ILegalEntities extends IPeopleModel {
    naturalPerson: INaturalPerson;
}
