import { PropsWithChildren } from 'react'
import clsx from 'clsx'

import styles from './Button.module.scss'

type Props = PropsWithChildren<{
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>

export const Button = ({
  children,
  className,
  type = 'button',
  ...props
}: Props) => (
  <button className={clsx(styles.Button, className)} {...props} type={type}>
    {children}
  </button>
)
