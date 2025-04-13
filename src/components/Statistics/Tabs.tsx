import { TabEnum, TabType } from './types'

import styles from './Statistics.module.scss'

const tabs: TabType[] = [
  { key: TabEnum.categories, label: 'По категориям' },
  { key: TabEnum.daily, label: 'По дням' },
  { key: TabEnum.charts, label: 'Графики' },
]

type Props = {
  activeTab: TabEnum
  setActiveTab: (activeTab: TabEnum) => void
}

export const Tabs = ({ activeTab, setActiveTab }: Props) => {
  return tabs.map((item) => (
    <button
      className={`${styles.Statistics__tab} ${activeTab === item.key ? styles.active : ''}`}
      onClick={() => setActiveTab(item.key)}
      key={item.key}
    >
      {item.label}
    </button>
  ))
}
