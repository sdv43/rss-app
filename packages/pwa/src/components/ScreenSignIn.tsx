import { useState, useContext } from 'preact/hooks'
import { apiSignIn, apiCodeGet } from '../api'
import { UNKNOWN_ERROR_MESSAGE } from '../constants'
import { route } from 'preact-router'
import { State } from '../store'
import { ComponentProps } from 'preact'
import { Button } from './Button'

interface IProps {
  path: string
}

export const ScreenSignIn = (_props: IProps) => {
  const { loadData } = useContext(State)
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeLoading, setIsCodeLoading] = useState(false)
  const [code, setCode] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit: ComponentProps<'form'>['onSubmit'] = async (event) => {
    try {
      event.preventDefault()

      setIsLoading(true)
      setErrMsg('')

      await apiSignIn(code)
      await loadData()

      route('/')
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

  const handleGenerateCode = async () => {
    try {
      setIsCodeLoading(true)
      setErrMsg('')
      setCode((await apiCodeGet()).code)
    } catch (error: any) {
      if ('message' in error) {
        setErrMsg(error.message)
      } else {
        setErrMsg(UNKNOWN_ERROR_MESSAGE)
        console.error(error)
      }
    } finally {
      setIsCodeLoading(false)
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
            type={'text'}
            name="code"
            value={code}
            placeholder={'Code'}
            onInput={(e) => setCode((e.target as HTMLInputElement).value)}
          />
        </label>

        <Button type={'submit'} isLoading={isLoading}>
          {isLoading ? 1 : 'Sign In'}
        </Button>

        <Button
          className={'button--secondary page-sign-in_gen-code-button'}
          type={'button'}
          isLoading={isCodeLoading}
          onClick={handleGenerateCode}
        >
          Generate code
        </Button>
      </form>
    </div>
  )
}
