export type TariffType = 'basic' | 'comfort' | 'premium';

export interface Tariff {
  id: TariffType;
  title: string;
  subtitle: string;
  description: string;
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
