import { ChartOptions, TooltipItem } from 'chart.js'

import { formatNumber, useResize } from '@/lib'

export const useBarOptions = () => {
  const { screenWidth } = useResize()

  const isSmallScreen = screenWidth < 1024

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

  return barOptions
}
