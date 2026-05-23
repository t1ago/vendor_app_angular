import { INaturalPerson } from './natural-person.model';
import { IPersonModel } from './person.model';

export interface ILegalEntities extends IPersonModel {
    naturalPerson: INaturalPerson;
}
