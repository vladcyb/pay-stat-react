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
  | 25

type ValueType = {
  name: string
  color: string
}

export const categoryMap: Record<CategoryMapIndex, ValueType> = {
  '1': {
    name: 'Еда',
    color: '#FF6633',
  },
  '2': {
    name: 'Фастфуд/готовая еда',
    color: '#FFB399',
  },
  '3': {
    name: 'Сладости',
    color: '#FF33FF',
  },
  '4': {
    name: 'Алкоголь',
    color: '#FFFF99',
  },
  '5': {
    name: 'Кафе',
    color: '#00B3E6',
  },
  '6': {
    name: 'Машина',
    color: '#E6B333',
  },
  '7': {
    name: 'Транспорт',
    color: '#3366E6',
  },
  '8': {
    name: 'Саморазвитие',
    color: '#999966',
  },
  '9': {
    name: 'Дом',
    color: '#99FF99',
  },
  '10': {
    name: 'Развлечения',
    color: '#B34D4D',
  },
  '11': {
    name: 'Путешествия',
    color: '#80B300',
  },
  '12': {
    name: 'Одежда',
    color: '#809900',
  },
  '13': {
    name: 'Техника',
    color: '#E6B3B3',
  },
  '14': {
    name: 'Спорт',
    color: '#6680B3',
  },
  '15': {
    name: 'Здоровье',
    color: '#66991A',
  },
  '16': {
    name: 'Табак',
    color: '#FF99E6',
  },
  '17': {
    name: 'Пакеты/контейнеры',
    color: '#CCFF1A',
  },
  '18': {
    name: 'Коммуналка',
    color: '#FF1A66',
  },
  '19': {
    name: 'Телефония',
    color: '#E6331A',
  },
  '20': {
    name: 'Другое',
    color: '#33FFCC',
  },
  '21': {
    name: 'Средства гигиены',
    color: '#66994D',
  },
  '22': {
    name: 'Питьевая вода',
    color: '#B366CC',
  },
  '23': {
    name: 'Заправка машины',
    color: '#4D8000',
  },
  '24': {
    name: 'ПО',
    color: '#B33300',
  },
  '25': {
    name: 'Подарки',
    color: '#B33300',
  },
}
