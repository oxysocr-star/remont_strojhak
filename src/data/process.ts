import { ProcessStep } from '../types';

export const processSteps: ProcessStep[] = [
  { id: '1', num: '01', title: 'Заявка', description: 'Клиент оставляет контакты', result: 'Быстрый первый контакт' },
  { id: '2', num: '02', title: 'Замер', description: 'Специалист смотрит объект', result: 'Понимание объема' },
  { id: '3', num: '03', title: 'Смета', description: 'Считается стоимость', result: 'Прозрачный бюджет' },
  { id: '4', num: '04', title: 'Договор', description: 'Фиксируются сроки и этапы', result: 'Защита условий' },
  { id: '5', num: '05', title: 'Ремонт', description: 'Выполняются работы', result: 'Отчеты и контроль' },
  { id: '6', num: '06', title: 'Сдача', description: 'Проверка результата', result: 'Готовый объект' }
];
