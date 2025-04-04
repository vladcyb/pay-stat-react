import { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import './Button.scss'
import clsx from 'clsx'

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>

export const Button = ({ children, className, ...props }: Props) => (
  <button className={clsx('Button', className)} {...props}>
    {children}
  </button>
)
