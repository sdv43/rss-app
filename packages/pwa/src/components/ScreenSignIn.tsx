import { useState, useContext } from 'preact/hooks'
import { apiSignIn } from '../api'
import { UNKNOWN_ERROR_MESSAGE } from '../constants'
import { Link, route } from 'preact-router'
import { State } from '../store'
import { ComponentProps } from 'preact'
import { Button } from './Button'

interface IProps {
  path: string
}

export const ScreenSignIn = (_props: IProps) => {
  const { loadData } = useContext(State)
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit: ComponentProps<'form'>['onSubmit'] = async (event) => {
    try {
      event.preventDefault()

      setIsLoading(true)
      setErrMsg('')

      const data = new FormData(event.target as HTMLFormElement)

      await apiSignIn(`${data.get('email')}`, `${data.get('password')}`)
      await loadData()

      route('/stories')
    } catch (error: any) {
      if ('message' in error) {
        setErrMsg(error.message)
      } else {
        setErrMsg(UNKNOWN_ERROR_MESSAGE)
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={'page-sign-in'}>
      <form className={'form'} onSubmit={handleSubmit}>
        <img
          className={'page-sign-in_app-logo'}
          width={64}
          src={'/icons/app-icon512.svg'}
        />

        {errMsg && <p className={'page-sign-in_error'}>{errMsg}</p>}

        <label>
          <input
            className={'input page-sign-in_code-input'}
            type={'email'}
            name="email"
            placeholder={'Email'}
          />
        </label>

        <label>
          <input
            className={'input page-sign-in_code-input'}
            type={'password'}
            name="password"
            placeholder={'Password'}
          />
        </label>

        <Button type={'submit'} isLoading={isLoading}>
          {isLoading ? 1 : 'Sign In'}
        </Button>

        <Link
          href="/sign-up"
          className={'button button--secondary page-sign-in_gen-code-button'}
          type={'button'}
        >
          Create account
        </Link>
      </form>
    </div>
  )
}
