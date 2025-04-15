import { Guide } from '@/sharedComponents/Guide'

import dataExample from './dataExample.json'

import styles from './FormatGuide.module.scss'

export const FormatGuide = () => (
  <Guide
    title="Формат входного файла"
    subtitle="Файл должен быть в формате JSON со следующей структурой:"
    rules={[
      {
        id: 1,
        content: (
          <>
            Даты должны быть в формате <strong>ГГГГММДД</strong>
          </>
        ),
      },
      { id: 2, content: 'Суммы указываются в любой валюте' },
      {
        id: 3,
        content:
          'В поле категории указывается номер категории (таблица категорий ниже)',
      },
      { id: 4, content: 'В один день может быть несколько платежей' },
      {
        id: 5,
        content:
          'Дни можно писать в любом порядке (они будут отсортированы по дате)',
      },
    ]}
  >
    <pre className={styles.FormatGuide__codeExample}>
      {JSON.stringify(dataExample, null, 2)}
    </pre>
  </Guide>
)
