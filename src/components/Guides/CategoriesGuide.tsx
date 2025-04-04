import { Category } from '../../types'
import styles from './CategoriesGuide.module.scss'

const categories: Category[] = [
  { id: 1, name: 'Продукты', description: 'Еда и напитки' },
  { id: 2, name: 'Рестораны', description: 'Питание вне дома' },
  { id: 3, name: 'Транспорт', description: 'Общественный транспорт' },
  { id: 4, name: 'Такси', description: 'Поездки на такси' },
  {
    id: 5,
    name: 'Коммунальные услуги',
    description: 'Квартплата, электричество, вода и т.д.',
  },
  { id: 6, name: 'Интернет и связь', description: 'Мобильная связь, интернет' },
  { id: 7, name: 'Развлечения', description: 'Кино, театры, концерты' },
  { id: 8, name: 'Одежда', description: 'Одежда и обувь' },
  { id: 9, name: 'Здоровье', description: 'Медицина, лекарства' },
  { id: 10, name: 'Образование', description: 'Курсы, книги, обучение' },
]

export const CategoriesGuide = () => {
  return (
    <div className={styles.container}>
      <h2>Категории расходов</h2>
      <p>Каждая категория расходов имеет свой уникальный код:</p>

      <div className={styles.categories}>
        {categories.map((category) => (
          <div key={category.id} className={styles.category}>
            <div className={styles.categoryHeader}>
              <span className={styles.categoryId}>{category.id}</span>
              <h3 className={styles.categoryName}>{category.name}</h3>
            </div>
            <p className={styles.categoryDescription}>{category.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.rules}>
        <h3>Правила:</h3>
        <ul>
          <li>Каждая категория имеет свой уникальный код</li>
          <li>Категория должна быть числом и быть в списке выше</li>
        </ul>
      </div>
    </div>
  )
}
