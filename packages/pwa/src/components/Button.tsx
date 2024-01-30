import { ComponentChildren, ComponentProps } from 'preact'
import { forwardRef } from 'preact/compat'
import { cl } from '../utils'

interface IProps extends ComponentProps<'button'> {
  isLoading?: boolean
  children: ComponentChildren
}

export const Button = forwardRef<HTMLButtonElement, IProps>(
  ({ children, className, isLoading, disabled, tabIndex = 0, ...props }) => {
    return (
      <button
        className={cl(className, 'button', isLoading && 'button--loading')}
        disabled={isLoading || disabled}
        tabIndex={tabIndex}
        {...props}
      >
        {isLoading && (
          <svg
            className={'button_loader'}
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              r="32"
              stroke-width="6"
              stroke="currentColor"
              stroke-dasharray="50.26548245743669 50.26548245743669"
              fill="none"
              stroke-linecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                values="0 50 50;360 50 50"
              ></animateTransform>
            </circle>
          </svg>
        )}

        <span className={'button_children'}>{children}</span>
      </button>
    )
  }
)
