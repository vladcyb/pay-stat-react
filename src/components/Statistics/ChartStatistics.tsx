import { useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  TooltipItem,
  Scale,
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { PaymentData } from '../../types'
import { categoryRussian } from '../../shared/constants/categoryRussian'
import styles from './ChartStatistics.module.scss'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

interface ChartStatisticsProps {
  data: PaymentData
}

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const ChartStatistics = ({ data }: ChartStatisticsProps) => {
  const [hiddenCategories, setHiddenCategories] = useState<number[]>([])

  const { pieData, barData, allCategories } = useMemo(() => {
    // Подготавливаем данные для круговой диаграммы по категориям
    const categoryTotals: Record<number, number> = {}
    const backgroundColors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#7FBA00',
      '#00A4EF',
      '#F25022',
      '#8E44AD',
      '#2ECC71',
      '#E74C3C',
      '#3498DB',
      '#F1C40F',
      '#1ABC9C',
      '#E67E22',
      '#95A5A6',
      '#16A085',
      '#D35400',
      '#27AE60',
      '#C0392B',
      '#2980B9',
    ]

    // Подготавливаем данные для столбчатой диаграммы по дням
    const dailyTotals: Record<string, number> = {}

    Object.entries(data.payments).forEach(([date, payments]) => {
      const visiblePayments = payments.filter(
        (payment) => !hiddenCategories.includes(payment.category)
      )
      dailyTotals[date] = visiblePayments.reduce((sum, p) => sum + p.value, 0)

      payments.forEach((payment) => {
        if (!hiddenCategories.includes(payment.category)) {
          categoryTotals[payment.category] =
            (categoryTotals[payment.category] || 0) + payment.value
        }
      })
    })

    // Получаем отсортированные видимые категории
    const visibleCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => Number(category))

    // Создаем соответствие категорий и цветов
    const categoryColors = new Map<number, string>()
    visibleCategories.forEach((category, index) => {
      categoryColors.set(category, backgroundColors[index])
    })

    const pieChartData = {
      labels: visibleCategories.map(
        (cat) => categoryRussian[cat as keyof typeof categoryRussian]
      ),
      datasets: [
        {
          data: visibleCategories.map((cat) => categoryTotals[cat]),
          backgroundColor: visibleCategories.map((cat) =>
            categoryColors.get(cat)
          ),
          borderWidth: 1,
        },
      ],
    }

    // Сортируем дни по возрастанию
    const sortedDates = Object.keys(dailyTotals).sort()
    const barChartData = {
      labels: sortedDates.map(
        (date) => `${date.slice(6, 8)}.${date.slice(4, 6)}`
      ),
      datasets: [
        {
          label: 'Расходы за день',
          data: sortedDates.map((date) => dailyTotals[date]),
          backgroundColor: '#2196f3',
          borderRadius: 4,
        },
      ],
    }

    // Получаем список всех категорий с их суммами
    const allCats = Object.entries(
      Object.values(data.payments).reduce(
        (acc, payments) => {
          payments.forEach((payment) => {
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
      pieData: pieChartData,
      barData: barChartData,
      allCategories: allCats,
    }
  }, [data, hiddenCategories])

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Распределение расходов по категориям',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'pie'>) => {
            const value = context.raw as number
            return ` ${formatNumber(value)}`
          },
        },
      },
    },
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Расходы по дням',
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
          callback: function (this: Scale, value: number | string) {
            if (typeof value === 'number') {
              return formatNumber(value)
            }
            return value
          },
        },
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
                {categoryRussian[category as keyof typeof categoryRussian]}
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
          <Pie data={pieData} options={pieOptions} />
        </div>
        <div className={styles.chart}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  )
}
