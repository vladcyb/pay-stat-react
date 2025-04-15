import { PropsWithChildren } from 'react'

import styles from './Button.module.scss'
import clsx from 'clsx'

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
