import { IStory, handleErrorResponse } from '.'

export interface IBookmark extends IStory {
  real_id: number
}

export const apiBookmarkGet = async () => {
  const response = await fetch('/api/bookmark', {
    headers: {
      Accept: 'application/json',
    },
  })

  await handleErrorResponse(response)

  return (await response.json()) as IBookmark[]
}

export const apiBookmarkCreate = async (
  bookmark: Omit<IBookmark, 'real_id'>
) => {
  const body = new FormData()
  body.append('id', `${bookmark.id}`)
  body.append('feed_id', `${bookmark.feed_id}`)
  body.append('title', bookmark.title)
  body.append('content', bookmark.content)
  body.append('link', bookmark.link)
  body.append('pub_date', `${bookmark.pub_date}`)

  const response = await fetch('/api/bookmark', {
    method: 'post',
    headers: {
      Accept: 'application/json',
    },
    body,
  })

  await handleErrorResponse(response)

  return (await response.json()) as { id: string }
}

export const apiBookmarkDelete = async (id: IBookmark['real_id']) => {
  const response = await fetch('/api/bookmark/' + id, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
    },
  })

  await handleErrorResponse(response)
  await response.json()

  return true
}
