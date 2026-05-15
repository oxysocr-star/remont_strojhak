export type KnowledgeItem = {
  id: string;
  title: string;
  category:
    | 'tariff'
    | 'case'
    | 'faq'
    | 'guarantee'
    | 'process'
    | 'pricing'
    | 'contacts';
  content: string;
  source: string;
  updatedAt: string;
};

export const knowledgeBase: KnowledgeItem[] = [
  {
    id: 'hero',
    title: 'О компании СтройХак (NovaRemont Studio)',
    category: 'pricing',
    content: 'Мы делаем ремонт квартир в Москве и МО. Наш подход — технологичность, прозрачность и эстетика. Мы не просто клеим обои, мы создаем пространство для жизни. Смета фиксируется, сроки соблюдаются.',
    source: 'hero.md',
    updatedAt: '2024-05-14'
  },
  {
    id: 'tariff-basic',
    title: 'Тариф Базовый (Косметический)',
    category: 'tariff',
    content: 'Для аренды или быстрой продажи. Цена от 6 500 ₽/м². Сроки от 2 недель. Включает малярные работы, замену покрытий пола и потолка.',
    source: 'tariffs.md',
    updatedAt: '2024-05-14'
  },
  {
    id: 'tariff-comfort',
    title: 'Тариф Комфорт (Капитальный)',
    category: 'tariff',
    content: 'Для жизни. Цена от 12 500 ₽/м². Сроки от 2 месяцев. Включает замену электрики, сантехники, выравнивание стен, стяжку, финишную отделку.',
    source: 'tariffs.md',
    updatedAt: '2024-05-14'
  },
  {
    id: 'tariff-premium',
    title: 'Тариф Премиум (Дизайнерский)',
    category: 'tariff',
    content: 'Для сложных объектов. Цена от 18 000 ₽/м². Сроки от 4 месяцев. Работа по дизайн-проекту, авторский надзор, премиум-материалы.',
    source: 'tariffs.md',
    updatedAt: '2024-05-14'
  },
  {
    id: 'pricing-logic',
    title: 'Логика расчета стоимости',
    category: 'pricing',
    content: 'Площадь x Тариф. Новостройка: +10% к базе (из-за усадки и доп. сетей). Вторичка: +20% (демонтаж). Коммерция: индивидуально.',
    source: 'calculator.md',
    updatedAt: '2024-05-14'
  },
  {
    id: 'process-steps',
    title: 'Этапы ремонта',
    category: 'process',
    content: '1. Замер. 2. Смета. 3. Договор. 4. Черновые работы (стены, электрика). 5. Инженерные системы. 6. Чистовая отделка. 7. Клининг. 8. Сдача.',
    source: 'process.md',
    updatedAt: '2024-05-14'
  },
  {
    id: 'cases-summary',
    title: 'Наши кейсы',
    category: 'case',
    content: 'ЖК HEADLINER (45м2, Комфорт, 62 дня), ЖК Символ (112м2, Премиум, 130 дней), ЖК Зиларт (90м2, Комфорт, 85 дней).',
    source: 'cases.md',
    updatedAt: '2024-05-14'
  },
  {
    id: 'guarantees',
    title: 'Гарантии и обязательства',
    category: 'guarantee',
    content: 'Гарантия 36 месяцев на все работы. Ответственность застрахована. Смета неизменна. Ежедневные видеоотчеты.',
    source: 'guarantees.md',
    updatedAt: '2024-05-14'
  },
  {
    id: 'faq-material-purchase',
    title: 'Закупка материалов',
    category: 'faq',
    content: 'Покупаем черновые и чистовые материалы со скидкой 20%. Работаем с Knauf, Rehau, Unis, Ceresit.',
    source: 'faq.md',
    updatedAt: '2024-05-14'
  },
  {
    id: 'contacts-main',
    title: 'Контакты компании',
    category: 'contacts',
    content: 'Москва, ул. Строителей, 25. Телефон: +7 (495) 123-45-67. Мессенджеры: @novaremont_bot.',
    source: 'contacts.md',
    updatedAt: '2024-05-14'
  }
];
