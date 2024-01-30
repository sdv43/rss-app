import { ComponentProps } from 'preact'
import { cl } from '../utils'

interface IProps extends ComponentProps<'svg'> {}

export const IconFeed = ({ className, ...props }: IProps) => {
  return (
    <svg
      className={cl(className, 'icon-feed')}
      viewBox="0 0 8 8"
      width="32"
      height="32"
      {...props}
    >
      <rect className={'icon-feed_rect'} width="8" height="8" rx="1.5" />
      <circle className={'icon-feed_el'} cx="2" cy="6" r="1" />
      <path
        className={'icon-feed_el'}
        d="m 1,4 a 3,3 0 0 1 3,3 h 1 a 4,4 0 0 0 -4,-4 z"
      />
      <path
        className={'icon-feed_el'}
        d="m 1,2 a 5,5 0 0 1 5,5 h 1 a 6,6 0 0 0 -6,-6 z"
      />
    </svg>
  )
}
