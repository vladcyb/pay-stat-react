import { useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  TooltipItem,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { PaymentData } from '../../types'
import {
  categoryMap,
  CategoryMapIndex,
} from '../../shared/constants/categoryMap.ts'
import styles from './ChartStatistics.module.scss'
import { formatNumber } from '../../shared/lib/formatNumber.ts'

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface ChartStatisticsProps {
  data: PaymentData
}

const formatDate = (dateStr: string) => {
  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)
  return `${day}.${month}.${year}`
}

export const ChartStatistics = ({ data }: ChartStatisticsProps) => {
  const [hiddenCategories, setHiddenCategories] = useState<number[]>([])
  const [regexFilter, setRegexFilter] = useState('')

  const { barData, allCategories, filteredTotal } = useMemo(() => {
    // Подготавливаем данные для столбчатой диаграммы по категориям
    const categoryTotals: Record<number, number> = {}

    // Фильтруем даты по регулярному выражению
    let filteredDates = Object.keys(data.payments)
    if (regexFilter) {
      try {
        const regex = new RegExp(`^${regexFilter}$`, 'i')
        filteredDates = filteredDates.filter((date) =>
          regex.test(formatDate(date))
        )
      } catch (error) {
        console.error('Invalid regex pattern:', error)
      }
    }

    let totalFilteredExpenses = 0

    // Собираем данные по категориям
    filteredDates.forEach((date) => {
      const payments = data.payments[date]
      const visiblePayments = payments.filter(
        (payment) => !hiddenCategories.includes(payment.category)
      )

      visiblePayments.forEach((payment) => {
        categoryTotals[payment.category] =
          (categoryTotals[payment.category] || 0) + payment.value
        totalFilteredExpenses += payment.value
      })
    })

    // Получаем отсортированные видимые категории
    const visibleCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => Number(category))

    // Создаем соответствие категорий и цветов
    const categoryColors = new Map<number, string>()
    visibleCategories.forEach((category) => {
      categoryColors.set(
        category,
        categoryMap[category as CategoryMapIndex].color
      )
    })

    // Создаем данные для столбчатой диаграммы по категориям
    const barChartData = {
      labels: visibleCategories.map(
        (cat) => categoryMap[cat as CategoryMapIndex].name
      ),
      datasets: [
        {
          label: 'Расходы по категориям',
          data: visibleCategories.map((cat) => categoryTotals[cat]),
          backgroundColor: visibleCategories.map((cat) =>
            categoryColors.get(cat)
          ),
          borderRadius: 4,
        },
      ],
    }

    // Получаем список всех категорий с их суммами для отображения в управлении категориями
    // Теперь учитываем только отфильтрованные даты
    const allCats = Object.entries(
      filteredDates.reduce(
        (acc, date) => {
          data.payments[date].forEach((payment) => {
            acc[payment.category] = (acc[payment.category] || 0) + payment.value
          })
          return acc
        },
        {} as Record<number, number>
      )
    )
      .sort(([, a], [, b]) => b - a)
      .map(([category, total]) => ({
        category: Number(category),
        total,
        isHidden: hiddenCategories.includes(Number(category)),
      }))

    return {
      barData: barChartData,
      allCategories: allCats,
      filteredTotal: totalFilteredExpenses,
    }
  }, [data, hiddenCategories, regexFilter])

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Расходы по категориям',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const value = context.raw as number
            return `Сумма: ${formatNumber(value)}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const toggleCategory = (category: number) => {
    setHiddenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
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
      <div className={styles.totalFilteredExpenses}>
        <h3>Общая сумма расходов за выбранный период</h3>
        <p>{formatNumber(filteredTotal)}</p>
      </div>
      <div className={styles.categoryToggles}>
        <h3>Управление категориями</h3>
        <div className={styles.toggles}>
          {allCategories.map(({ category, total, isHidden }) => (
            <button
              key={category}
              className={`${styles.toggleButton} ${isHidden ? styles.hidden : ''}`}
              onClick={() => toggleCategory(category)}
            >
              <span className={styles.categoryName}>
                {categoryMap[category as CategoryMapIndex].name}
              </span>
              <span className={styles.categoryTotal}>
                {formatNumber(total)}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.charts}>
        <div className={styles.chart}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  )
}
