import { useContext, useState } from 'preact/hooks'
import { TopBar } from './TopBar'
import { State } from '../store'
import {
  ISettings,
  apiCodeUpdate,
  apiSettingsGet,
  apiSettingsUpdate,
  apiSignOut,
  apiPushSubscriptionCreate,
  apiPushSubscriptionDelete,
} from '../api'
import { useSignalEffect } from '@preact/signals'
import { route } from 'preact-router'
import { ComponentProps } from 'preact'
import { Button } from './Button'
import { APP_SERVER_KEY } from '../constants'

interface IProps {
  path: string
}

export const ScreenAccount = (_props: IProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false)
  const [isCodeLoading, setIsCodeLoading] = useState(false)
  const [isSignOutLoading, setIsSignOutLoading] = useState(false)
  const [code, setCode] = useState<ISettings['password']>('')
  const [notif, setNotif] = useState<ISettings['notifications']>('')
  const [theme, setTheme] = useState<ISettings['theme']>('auto')
  const { settings, resetState } = useContext(State)

  useSignalEffect(() => {
    if (!settings.value) {
      return
    }

    setCode(settings.value.password)
    setNotif(settings.value.notifications)
    setTheme(settings.value.theme)
  })

  const handleFormSubmit: ComponentProps<'form'>['onSubmit'] = async (
    event
  ) => {
    try {
      setIsLoading(true)
      event.preventDefault()

      await apiSettingsUpdate({
        notifications: notif,
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

  const handleToggleNotifications = async () => {
    try {
      setIsNotificationsLoading(true)

      if (import.meta.env.DEV) {
        if (settings.value?.subscription) {
          await apiPushSubscriptionDelete()
        } else {
          if (Notification.permission !== 'granted') {
            await Notification.requestPermission()
          }

          if (Notification.permission !== 'granted') {
            alert(
              'You have disabled notifications in your browser settings. If you want to recieve notificatoins you should switch this option to enable.'
            )
            return
          }

          await apiPushSubscriptionCreate(
            JSON.stringify({
              endpoint: 'https://push-api.server/send/fB526bov5pg:123456',
              expirationTime: null,
              keys: {
                p256dh: 'p256h',
                auth: 'auth-key',
              },
            })
          )
        }

        return
      }

      const swRegistration = await navigator.serviceWorker.getRegistration()

      if (!swRegistration) {
        alert('You does not have a registered service worker')
        return
      }

      if (settings.value?.subscription) {
        let subscription = await swRegistration.pushManager.getSubscription()

        if (subscription) {
          await subscription.unsubscribe()
        }

        await apiPushSubscriptionDelete()
      } else {
        if ((await Notification.requestPermission()) !== 'granted') {
          alert(
            'You have disabled notifications in your browser settings. If you want to recieve notificatoins you should switch this option to enable.'
          )
          return
        }

        let subscription = await swRegistration.pushManager.getSubscription()

        if (!subscription) {
          subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: APP_SERVER_KEY,
          })

          if (!subscription) {
            alert('Cannot subscribe to push notifications')
            return
          }
        }

        await apiPushSubscriptionCreate(JSON.stringify(subscription.toJSON()))
      }
    } catch (error) {
      alert(error)
    } finally {
      settings.value = await apiSettingsGet()
      setIsNotificationsLoading(false)
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

        <Button
          isLoading={isNotificationsLoading}
          className={'button--secondary'}
          type={'button'}
          onClick={() => handleToggleNotifications()}
        >
          {settings.value?.subscription ? 'Disable' : 'Enable'} notifications
        </Button>

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
