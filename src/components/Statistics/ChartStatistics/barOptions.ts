import { ChartOptions, TooltipItem } from 'chart.js'
import { formatNumber } from '../../../shared/lib/formatNumber.ts'

export const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  indexAxis: 'y',
  maintainAspectRatio: false,
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
      ticks: {
        maxRotation: 0,
        autoSkip: false,
        padding: 0,
      },
      grid: {
        display: true,
        lineWidth: 1,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  layout: {
    padding: {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20,
    },
  },
}
