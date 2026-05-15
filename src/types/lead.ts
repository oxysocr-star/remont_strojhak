import { TariffType } from './tariff';

export type ObjectType = 'newBuilding' | 'secondary' | 'demolition' | 'afterBadContractor';

export interface Lead {
  source: string;
  name: string;
  phone: string;
  area: number;
  objectType: ObjectType;
  repairType: TariffType;
  comment?: string;
}
