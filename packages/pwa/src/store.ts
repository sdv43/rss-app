import { signal } from '@preact/signals'
import { createContext } from 'preact'
import {
  IBookmark,
  IFeed,
  ISettings,
  apiBookmarkGet,
  apiFeedGet,
  apiSettingsGet,
  apiStoryGet,
} from './api'

type TStories = Awaited<ReturnType<typeof apiStoryGet>>

export const createState = () => {
  const isLoading = signal(false)
  const feeds = signal<IFeed[]>([])
  const stories = signal<TStories>([])
  const bookmarks = signal<IBookmark[]>([])
  const settings = signal<ISettings | undefined>(undefined)

  const resetState = () => {
    settings.value = undefined
    stories.value = []
    bookmarks.value = []
    feeds.value = []
  }

  const loadData = async () => {
    const [apiSettings, apiFeeds, apiStories, apiBookmarks] = await Promise.all(
      [apiSettingsGet(), apiFeedGet(), apiStoryGet(), apiBookmarkGet()]
    )

    settings.value = apiSettings
    feeds.value = apiFeeds
    stories.value = apiStories
    bookmarks.value = apiBookmarks
  }

  return {
    feeds,
    stories,
    bookmarks,
    settings,
    isLoading,
    loadData,
    resetState,
  }
}

export const State = createContext<ReturnType<typeof createState>>(
  createState()
)
