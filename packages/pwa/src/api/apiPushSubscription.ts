import { handleErrorResponse } from '.'

export const apiPushSubscriptionCreate = async (subscription: string) => {
  const body = new URLSearchParams()
  body.append('subscription', subscription)

  const response = await fetch('/api/push-subscription', {
    method: 'post',
    headers: {
      Accept: 'application/json',
    },
    body,
  })

  await handleErrorResponse(response)
  await response.json()

  return true
}

export const apiPushSubscriptionDelete = async () => {
  const response = await fetch('/api/push-subscription', {
    method: 'delete',
    headers: {
      Accept: 'application/json',
    },
  })

  await handleErrorResponse(response)

  return true
}
