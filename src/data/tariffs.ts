import { Tariff } from '../types';

export const tariffs: Tariff[] = [
  {
    id: 'basic',
    title: 'Базовый',
    subtitle: 'для аренды',
    description: 'Для быстрой сдачи в аренду, продажи или недорогого ремонта без лишних решений.',
    features: {
      rough: true,
      fine: true,
      reports: true,
      materials: false,
      design: false,
      supervision: false,
      engineering: false
    }
  },
  {
    id: 'comfort',
    title: 'Комфорт',
    subtitle: 'для жизни',
    description: 'Для ремонта квартиры под себя: с понятной сметой, подбором материалов и отчетами.',
    features: {
      rough: true,
      fine: true,
      reports: true,
      materials: true,
      design: 'partial',
      supervision: false,
      engineering: false
    }
  },
  {
    id: 'premium',
    title: 'Премиум',
    subtitle: 'для сложных объектов',
    description: 'Для сложных проектов, инженерных решений и ремонта по дизайн-проекту.',
    features: {
      rough: true,
      fine: true,
      reports: true,
      materials: true,
      design: true,
      supervision: true,
      engineering: true
    }
  }
];
