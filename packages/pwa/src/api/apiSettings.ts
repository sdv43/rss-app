import { handleErrorResponse } from '.'

export interface ISettings {
  code: string
  notifications_period: string
  theme: 'light' | 'dark' | 'auto'
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

export const apiSettingsUpdate = async (settings: Omit<ISettings, 'code'>) => {
  const body = new URLSearchParams()
  body.append('notifications_period', settings.notifications_period)
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
