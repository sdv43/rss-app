import { useContext, useState } from 'preact/hooks'
import { TopBar } from './TopBar'
import { State } from '../store'
import {
  ISettings,
  apiCodeUpdate,
  apiSettingsGet,
  apiSettingsUpdate,
  apiSignOut,
} from '../api'
import { useSignalEffect } from '@preact/signals'
import { route } from 'preact-router'
import { ComponentProps } from 'preact'
import { Button } from './Button'

interface IProps {
  path: string
}

export const ScreenAccount = (_props: IProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeLoading, setIsCodeLoading] = useState(false)
  const [isSignOutLoading, setIsSignOutLoading] = useState(false)
  const [code, setCode] = useState<ISettings['code']>('')
  const [notif, setNotif] = useState<ISettings['notifications_period']>('')
  const [theme, setTheme] = useState<ISettings['theme']>('auto')
  const { settings, resetState } = useContext(State)

  useSignalEffect(() => {
    if (!settings.value) {
      return
    }

    setCode(settings.value.code)
    setNotif(settings.value.notifications_period)
    setTheme(settings.value.theme)
  })

  const handleFormSubmit: ComponentProps<'form'>['onSubmit'] = async (
    event
  ) => {
    try {
      setIsLoading(true)
      event.preventDefault()

      await apiSettingsUpdate({
        notifications_period: notif,
        theme,
      })

      settings.value = await apiSettingsGet()
    } catch (error) {
      alert(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsSignOutLoading(true)
      await apiSignOut()
      route('/sign-in')
      resetState()
    } catch (error) {
      alert(error)
    } finally {
      setIsSignOutLoading(false)
    }
  }

  const handleUpdateCode = async () => {
    try {
      setIsCodeLoading(true)
      const { code } = await apiCodeUpdate()
      setCode(code)
    } catch (error) {
      alert(error)
    } finally {
      setIsCodeLoading(false)
    }
  }

  return (
    <div>
      <TopBar
        title="Account"
        actions={
          <Button form={'form-account'} type={'submit'} isLoading={isLoading}>
            Save
          </Button>
        }
      />

      <form
        id={'form-account'}
        className={'form form-account'}
        onSubmit={handleFormSubmit}
      >
        <label className={'form-control'}>
          <span className={'form-control_label'}>Authentification code</span>
          <input
            required
            readOnly
            className={'input form-control_input'}
            type={'text'}
            value={code}
            onInput={(e) => setCode((e.target as HTMLInputElement).value)}
          />
        </label>

        <Button
          isLoading={isCodeLoading}
          className={'button--secondary'}
          type={'button'}
          onClick={() => handleUpdateCode()}
        >
          Update code
        </Button>

        <label className={'form-control'}>
          <span className={'form-control_label'}>Notifications</span>
          <input
            pattern={'[0-9]{2}-[0-9]{2}:[0-9]{2}(;[0-9]{2}-[0-9]{2}:[0-9]{2})*'}
            required
            className={'input form-control_input'}
            type={'text'}
            value={notif}
            onInput={(e) => setNotif((e.target as HTMLInputElement).value)}
          />
        </label>

        <div className={'form-control'}>
          <span className={'form-control_label'}>Theme</span>
          <label className={'form-control-checkbox'}>
            <input
              className={'input-checkbox'}
              type={'radio'}
              name={'theme'}
              checked={theme === 'auto'}
              onClick={() => setTheme('auto')}
            />
            <span className={'form-control-checkbox_label'}>Auto</span>
          </label>

          <label className={'form-control-checkbox'}>
            <input
              className={'input-checkbox'}
              type={'radio'}
              name={'theme'}
              checked={theme === 'light'}
              onClick={() => setTheme('light')}
            />
            <span className={'form-control-checkbox_label'}>Light</span>
          </label>

          <label className={'form-control-checkbox'}>
            <input
              className={'input-checkbox'}
              type={'radio'}
              name={'theme'}
              checked={theme === 'dark'}
              onClick={() => setTheme('dark')}
            />
            <span className={'form-control-checkbox_label'}>Dark</span>
          </label>
        </div>

        <Button
          type={'button'}
          onClick={() => handleSignOut()}
          isLoading={isSignOutLoading}
        >
          Sign out
        </Button>
      </form>
    </div>
  )
}
