export type CategoryMapIndex =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24

type ValueType = {
  name: string
  color: string
}

export const categoryMap: Record<CategoryMapIndex, ValueType> = {
  1: { name: 'Еда', color: '#FF6384' },
  2: { name: 'Фастфуд', color: '#36A2EB' },
  3: { name: 'Сладости', color: '#FFCE56' },
  4: { name: 'Алкоголь', color: '#4BC0C0' },
  5: { name: 'Кафе', color: '#9966FF' },
  6: { name: 'Машина', color: '#FF9F40' },
  7: { name: 'Транспорт', color: '#7FBA00' },
  8: { name: 'Образование', color: '#00A4EF' },
  9: { name: 'Дом', color: '#F25022' },
  10: { name: 'Развлечения', color: '#8E44AD' },
  11: { name: 'Путешествия', color: '#2ECC71' },
  12: { name: 'Одежда', color: '#E74C3C' },
  13: { name: 'Техника', color: '#3498DB' },
  14: { name: 'Спорт', color: '#F1C40F' },
  15: { name: 'Здоровье', color: '#1ABC9C' },
  16: { name: 'Табак', color: '#E67E22' },
  17: { name: 'Пакеты/контейнеры', color: '#95A5A6' },
  18: { name: 'Коммуналка', color: '#16A085' },
  19: { name: 'Телефония', color: '#D35400' },
  20: { name: 'Другое', color: '#27AE60' },
  21: { name: 'Средства гигиены', color: '#C0392B' },
  22: { name: 'Питьевая вода', color: '#2980B9' },
  23: { name: 'Заправка машины', color: '#c600e5' },
  24: { name: 'ПО', color: '#593900' },
}
