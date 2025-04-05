import { categoryRussian } from '../../../shared/constants/categoryRussian.ts'

import styles from './CategoriesGuide.module.scss'
import { Guide } from '../../shared/Guide'

export const CategoriesGuide = () => (
  <Guide
    title="Категории расходов"
    subtitle="Каждая категория расходов имеет свой уникальный код:"
    rules={[
      { id: 1, content: 'Каждая категория имеет свой уникальный код' },
      { id: 2, content: 'Категория должна быть числом и быть в списке выше' },
    ]}
  >
    <div className={styles.CategoriesGuide__categories}>
      {Object.entries(categoryRussian).map(([categoryId, categoryName]) => (
        <div key={categoryId} className={styles.CategoriesGuide__category}>
          <div className={styles.categoriesGuide__categoryHeader}>
            <div>{categoryId}</div>
            <strong className={styles.categoriesGuide__categoryName}>
              {categoryName}
            </strong>
          </div>
        </div>
      ))}
    </div>
  </Guide>
)
