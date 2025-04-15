import { PropsWithChildren, ReactNode } from 'react'

import styles from './Guide.module.scss'

type RuleType = {
  id: number
  content: ReactNode
}

type Props = {
  title: string
  subtitle: string
  rules: RuleType[]
}

export const Guide = ({
  title,
  subtitle,
  children,
  rules,
}: PropsWithChildren<Props>) => (
  <section className={styles.Guide}>
    <h2 className={styles.Guide__title}>{title}</h2>
    <p className={styles.Guide__subtitle}>{subtitle}</p>
    {children}
    <div className={styles.Guide__rules}>
      <h3 className={styles.Guide__rulesTitle}>Правила</h3>
      <ul className={styles.Guide__rulesList}>
        {rules.map((rule) => (
          <li className={styles.Guide__rulesListItem} key={rule.id}>
            {rule.content}
          </li>
        ))}
      </ul>
    </div>
  </section>
)
