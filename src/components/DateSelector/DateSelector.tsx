import styles from './DateSelector.module.scss'
import { formatDate } from '../../shared/lib/formatDate.ts'
import { formatNumber } from '../../shared/lib/formatNumber.ts'
import { useMemo } from 'react'
import { DayStats } from '../../shared/types/DayStats.ts'

type Props = {
  /** Фильтр даты */
  regexFilter: string

  /** Сеттер фильтра даты */
  setRegexFilter: (value: string) => void

  /** Отфильтрованные покупки (группировка по дням) */
  filteredDailyPayments: DayStats[]
}

export const DateSelector = ({
  regexFilter,
  setRegexFilter,
  filteredDailyPayments,
}: Props) => {
  const totalFilteredExpenses = useMemo(() => {
    return filteredDailyPayments.reduce((sum, day) => sum + day.total, 0)
  }, [filteredDailyPayments])

  return (
    <>
      <div>
        <input
          className={styles.filterInput}
          type="text"
          value={regexFilter}
          onChange={(e) => setRegexFilter(e.target.value)}
          placeholder="Фильтр по дате (регулярное выражение)"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>
      {regexFilter && (
        <div className={styles.totalFilteredExpenses}>
          <h3>Выбранные даты:</h3>
          <div>
            {filteredDailyPayments.map((item) => (
              <div>{formatDate(item.date)}</div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.totalFilteredExpenses}>
        <h3>Общая сумма расходов за выбранный период</h3>
        <p>{formatNumber(totalFilteredExpenses)}</p>
      </div>
    </>
  )
}
