import { handleErrorResponse } from '.'

export const apiSignIn = async (email: string, password: string) => {
  const body = new FormData()
  body.append('password', password)
  body.append('email', email)

  const response = await fetch('/api/sign-in', {
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

export const apiCodeGet = async () => {
  const response = await fetch('/api/code', {
    headers: {
      Accept: 'application/json',
    },
  })

  await handleErrorResponse(response)

  return (await response.json()) as { code: string }
}

export const apiCodeUpdate = async () => {
  const response = await fetch('/api/code', {
    method: 'post',
    headers: {
      Accept: 'application/json',
    },
  })

  await handleErrorResponse(response)

  return (await response.json()) as { code: string }
}

export const apiSignOut = async () => {
  const response = await fetch('/api/sign-out', {
    method: 'get',
    headers: {
      Accept: 'application/json',
    },
  })

  await handleErrorResponse(response)
  await response.json()

  return true
}
