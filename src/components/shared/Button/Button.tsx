import { PropsWithChildren } from 'react'

import styles from './Button.module.scss'

type ButtonProps = PropsWithChildren<{
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
}: ButtonProps) => (
  <button className={styles.Button} {...props} type={type}>
    {children}
  </button>
)
