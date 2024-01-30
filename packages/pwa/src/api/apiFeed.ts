import { handleErrorResponse } from '.'

export interface IFeed {
  id: number
  name: string
  icon_link?: string
  link: string
  ttl: number
}

export const apiFeedGet = async () => {
  const response = await fetch('/api/feed', {
    headers: {
      Accept: 'application/json',
    },
  })

  await handleErrorResponse(response)

  return (await response.json()) as IFeed[]
}

export const apiFeedCheck = async (link: string) => {
  const response = await fetch(
    '/api/feed/check?link=' + encodeURIComponent(link),
    {
      headers: {
        Accept: 'application/json',
      },
    }
  )

  await handleErrorResponse(response)

  return (await response.json()) as {
    name: string
    icon_link: string | null
    stories_count: number
  }
}

export const apiFeedCreate = async (
  feed: Pick<IFeed, 'name' | 'icon_link' | 'link'>
) => {
  const body = new FormData()
  body.append('name', feed.name)
  body.append('link', feed.link)
  body.append('icon_link', feed.icon_link ?? '')

  const response = await fetch('/api/feed', {
    method: 'post',
    headers: {
      Accept: 'application/json',
    },
    body,
  })

  await handleErrorResponse(response)

  return (await response.json()) as { id: string }
}

export const apiFeedUpdate = async (
  feed: Pick<IFeed, 'id' | 'name' | 'icon_link' | 'link'>
) => {
  const body = new URLSearchParams()
  body.append('name', feed.name)
  body.append('link', feed.link)
  body.append('icon_link', feed.icon_link ?? '')

  const response = await fetch('/api/feed/' + feed.id, {
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

export const apiFeedDelete = async (id: IFeed['id']) => {
  const response = await fetch('/api/feed/' + id, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
    },
  })

  await handleErrorResponse(response)
  await response.json()

  return true
}
