import { ComponentChild } from 'preact'

interface IProps {
  title: string
  actions?: ComponentChild
}

export const TopBar = ({ title, actions }: IProps) => {
  return (
    <header className={'top-bar'}>
      <h1 className={'top-bar_title'}>{title}</h1>
      <span className={'top-bar_actions'}>{actions}</span>
    </header>
  )
}
