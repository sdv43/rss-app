import { handleErrorResponse } from '.'

export interface IStory {
  id: string
  feed_id: number
  title: string
  content: string
  link: string
  pub_date: number
}

export const apiStoryGet = async () => {
  const response = await fetch('/api/story', {
    headers: {
      Accept: 'application/json',
    },
  })

  await handleErrorResponse(response)

  const readStoryIds = JSON.parse(
    window.localStorage.getItem('read-story-ids') ?? '[]'
  ) as string[]

  const stories = ((await response.json()) as IStory[]).map((s) => {
    return {
      ...s,
      is_read: readStoryIds.includes(s.id),
    }
  })

  return stories
}

export const apiStoryMarkAsRead = (id: IStory['id']) => {
  const ids = JSON.parse(
    window.localStorage.getItem('read-story-ids') ?? '[]'
  ) as string[]

  if (!ids.includes(id)) {
    ids.push(id)
  }

  window.localStorage.setItem('read-story-ids', JSON.stringify(ids))
}
