import { categoryMap } from '@/constants/categoryMap.ts'
import { Guide } from '@/sharedComponents/Guide'

import styles from './CategoriesGuide.module.scss'

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
      {Object.entries(categoryMap).map(
        ([categoryId, { name: categoryName }]) => (
          <div key={categoryId} className={styles.CategoriesGuide__category}>
            <div className={styles.categoriesGuide__categoryHeader}>
              <div>{categoryId}</div>
              <strong className={styles.categoriesGuide__categoryName}>
                {categoryName}
              </strong>
            </div>
          </div>
        )
      )}
    </div>
  </Guide>
)
