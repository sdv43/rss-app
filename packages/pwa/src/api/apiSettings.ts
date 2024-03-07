import { handleErrorResponse } from '.'

export interface ISettings {
  password: string
  notifications: string
  theme: 'light' | 'dark' | 'auto'
  subscription: string | null
}

export const apiSettingsGet = async () => {
  const response = await fetch('/api/settings', {
    headers: {
      Accept: 'application/json',
    },
  })

  await handleErrorResponse(response)

  return (await response.json()) as ISettings
}

export const apiSettingsUpdate = async (
  settings: Omit<ISettings, 'password' | 'subscription'>
) => {
  const body = new URLSearchParams()
  body.append('notifications', settings.notifications)
  body.append('theme', settings.theme)

  const response = await fetch('/api/settings', {
    method: 'put',
    headers: {
      Accept: 'application/json',
    },
    body,
  })

  await handleErrorResponse(response)
  await response.json()

  return true
}
