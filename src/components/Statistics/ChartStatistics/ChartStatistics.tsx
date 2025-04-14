import { useMemo, useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartData,
  ChartOptions,
  TooltipItem,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { PaymentData } from '../../../types'
import {
  categoryMap,
  CategoryMapIndex,
} from '../../../shared/constants/categoryMap.ts'
import { formatNumber } from '../../../shared/lib/formatNumber.ts'
import { formatDate } from '../../../shared/lib/formatDate.ts'
import { DateSelector } from '../../DateSelector'
import { DayStats } from '../../../shared/types/DayStats.ts'

import styles from './ChartStatistics.module.scss'

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface ChartStatisticsProps {
  data: PaymentData
}

export const ChartStatistics = ({ data }: ChartStatisticsProps) => {
  const [hiddenCategories, setHiddenCategories] = useState<number[]>([])
  const [regexFilter, setRegexFilter] = useState('')
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024)

  const { barData, allCategories } = useMemo(() => {
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
      .toSorted(([, a], [, b]) => b - a)
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
    const barChartData: ChartData<'bar'> = {
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
          barPercentage: 0.8,
          categoryPercentage: 0.9,
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
      .toSorted(([, a], [, b]) => b - a)
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

  const toggleCategory = (category: number) => {
    setHiddenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const dailyStats = useMemo(() => {
    const stats: DayStats[] = Object.entries(data.payments).map(
      ([date, payments]) => {
        const total = payments.reduce((sum, payment) => sum + payment.value, 0)
        return {
          date,
          total,
          payments: [...payments].toSorted((a, b) => b.value - a.value), // Сортировка по убыванию суммы
        }
      }
    )

    // Сортировка дней по убыванию даты (сначала новые)
    return stats.toSorted((a, b) => b.date.localeCompare(a.date))
  }, [data])

  const filteredDailyPayments = useMemo(() => {
    if (!regexFilter) return dailyStats

    try {
      const regex = new RegExp(`^${regexFilter}$`, 'i')
      return dailyStats.filter((day) => regex.test(formatDate(day.date)))
    } catch (error) {
      console.error('Invalid regex pattern:', error)
      // Если регулярное выражение некорректное, показываем все дни
      return dailyStats
    }
  }, [dailyStats, regexFilter])

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: isSmallScreen,
        position: 'bottom',
        align: 'start',
        labels: {
          boxWidth: 16,
          padding: 15,
          font: {
            size: 12,
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets[0]
            if (!datasets.backgroundColor || !chart.data.labels) {
              return []
            }
            const colors = datasets.backgroundColor as string[]
            return chart.data.labels.map((label, i) => ({
              text: label as string,
              fillStyle: colors[i],
              hidden: false,
              lineCap: 'butt',
              lineDash: [],
              lineDashOffset: 0,
              lineJoin: 'miter',
              lineWidth: 1,
              strokeStyle: colors[i],
              pointStyle: 'rect',
              rotation: 0,
            }))
          },
        },
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
        ticks: {
          maxRotation: 0,
          autoSkip: false,
          padding: 10,
          display: !isSmallScreen,
        },
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: true,
        },
      },
    },
    layout: {
      padding: {
        bottom: isSmallScreen ? 160 : 20,
      },
    },
  }

  return (
    <div className={styles.Statistics}>
      <DateSelector
        regexFilter={regexFilter}
        setRegexFilter={setRegexFilter}
        filteredDailyPayments={filteredDailyPayments}
      />
      <div className={styles.Statistics__categoryToggles}>
        <h3 className={styles.Statistics__h3}>Управление категориями</h3>
        <div className={styles.Statistics__toggles}>
          {allCategories.map(({ category, total, isHidden }) => (
            <button
              key={category}
              className={`${styles.Statistics__toggleButton} ${isHidden ? styles.hidden : ''}`}
              onClick={() => toggleCategory(category)}
            >
              <span className={styles.Statistics__categoryName}>
                {categoryMap[category as CategoryMapIndex].name}
              </span>
              <span className={styles.Statistics__categoryTotal}>
                {formatNumber(total)}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.Statistics__chart}>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  )
}
