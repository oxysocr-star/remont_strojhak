import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'site-content');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

const files = [
  { name: 'hero.md', content: '# Главная\nМы делаем крутой ремонт.' },
  { name: 'tariffs.md', content: '# Тарифы\n- Базовый: 12000 руб/м2\n- Комфорт: 25000 руб/м2\n- Премиум: 45000 руб/м2' },
  { name: 'calculator.md', content: '# Калькулятор\nРасчет стоимости ремонта зависит от площади, типа жилья и тарифа.' },
  { name: 'process.md', content: '# Процесс\n1. Замер 2. Смета 3. Договор 4. Ремонт 5. Сдача' },
  { name: 'cases.md', content: '# Кейсы\nСмотрите наши работы на сайте.' },
  { name: 'reviews.md', content: '# Отзывы\nМы гордимся нашими отзывами.' },
  { name: 'guarantees.md', content: '# Гарантии\nГарантия 3 года на все виды работ.' },
  { name: 'faq.md', content: '# Частые вопросы\nКак быстро? 2-3 месяца для 50м2.' },
  { name: 'contacts.md', content: '# Контакты\nЗвоните нам.' }
];

for (const f of files) {
  fs.writeFileSync(path.join(contentDir, f.name), f.content);
}
console.log('Docs created');
