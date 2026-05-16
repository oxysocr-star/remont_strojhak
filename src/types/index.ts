export type TariffType = 'basic' | 'comfort' | 'premium';
export type ObjectType = 'newBuilding' | 'secondary' | 'demolition' | 'afterBadContractor';

export interface Tariff {
  id: TariffType;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  features: {
    rough: boolean;
    fine: boolean;
    reports: boolean;
    materials: boolean | 'partial';
    design: boolean | 'partial';
    supervision: boolean;
    engineering: boolean;
  };
}

export interface Case {
  id: string;
  title: string;
  area: number;
  tariff: string; // Comfort etc
  durationDays: number;
  budget: number;
  task: string;
  workDone: string;
  result: string;
  imageBefore: string;
  imageAfter: string;
  review?: {
    name: string;
    fearBefore: string;
    likedAfter: string;
    rating: number;
  };
  objectType: 'rent' | 'life' | 'premium';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProcessStep {
  id: string;
  num: string;
  title: string;
  description: string;
  result: string;
}
