import { Case } from '../types';

export const casesData: Case[] = [
  {
    id: 'case-1',
    title: 'ЖК "HEADLINER"',
    area: 45,
    tariff: 'Комфорт',
    durationDays: 62,
    budget: 1250000,
    task: 'Сделать ремонт под аренду за 2,5 месяца.',
    workDone: 'Черновые работы, электрика, сантехника, чистовая отделка, комплектация.',
    result: 'Объект сдан в срок. Клиент начал показы арендаторам через 3 дня после приемки.',
    imageBefore: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=1000&auto=format&fit=crop',
    imageAfter: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
    objectType: 'rent',
    review: {
      name: 'Алексей',
      rating: 5,
      fearBefore: 'До ремонта переживал, что смета вырастет в процессе.',
      likedAfter: 'В итоге стоимость работ была зафиксирована, а все изменения согласовывались заранее.'
    }
  },
  {
    id: 'case-2',
    title: 'ЖК "Символ"',
    area: 112,
    tariff: 'Премиум',
    durationDays: 130,
    budget: 4500000,
    task: 'Реализовать сложный дизайн-проект с умным домом.',
    workDone: 'Сложная инженерия, умный дом, шумоизоляция, чистовая отделка премиум-материалами.',
    result: 'Квартира полностью соответствует дизайн-проекту. Все системы работают исправно.',
    imageBefore: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
    imageAfter: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000&auto=format&fit=crop',
    objectType: 'premium',
    review: {
      name: 'Иван Сергеевич',
      rating: 5,
      fearBefore: 'Опасался затягивания сроков и непредвиденных доплат, особенно при такой сложной инженерии.',
      likedAfter: 'Сделали ремонт за 4 месяца, как и обещали в самом начале. Смета ни на рубль не выросла в процессе. Качество отличное.'
    }
  },
  {
    id: 'case-3',
    title: 'ЖК "Зиларт"',
    area: 90,
    tariff: 'Комфорт',
    durationDays: 85,
    budget: 2200000,
    task: 'Качественный ремонт для семьи с двумя детьми.',
    workDone: 'Перепланировка, возведение перегородок, сантехника, электрика, отделка.',
    result: 'Уютная и светлая квартира. Дети в восторге от своих комнат.',
    imageBefore: 'https://images.unsplash.com/photo-1516880711640-ef7daf815e1b?q=80&w=1000&auto=format&fit=crop',
    imageAfter: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1000&auto=format&fit=crop',
    objectType: 'life',
    review: {
      name: 'Анна Макарова',
      rating: 5,
      fearBefore: 'Очень переживала за черновые работы и необходимость контролировать рабочих на стройке.',
      likedAfter: 'Ребята слали детализированные видеоотчеты каждый вечер. Никакого стресса, впервые такой приятный опыт ремонта.'
    }
  }
];
