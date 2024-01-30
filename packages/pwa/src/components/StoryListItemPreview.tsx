import { ExternalLink, BookmarkPlus, BookmarkMinus } from 'lucide-preact'
import { useContext, useEffect, useRef } from 'preact/hooks'
import {
  IFeed,
  IStory,
  apiBookmarkCreate,
  apiBookmarkDelete,
  apiBookmarkGet,
  apiStoryMarkAsRead,
} from '../api'
import { State } from '../store'
import { Button } from './Button'

interface IProps {
  story?: IStory & { feed: IFeed }
}

export const StoryListItemPreview = ({ story }: IProps) => {
  const storyDialogRef = useRef<HTMLDialogElement>(null)
  const { bookmarks, stories } = useContext(State)

  const bookmark = bookmarks.value.find((b) => b.id === story?.id)

  const handleStorySave = async () => {
    try {
      if (!story) {
        return
      }

      if (bookmark) {
        await apiBookmarkDelete(bookmark.real_id)
      } else {
        await apiBookmarkCreate(story)
      }

      bookmarks.value = await apiBookmarkGet()
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    if (story) {
      storyDialogRef.current?.showModal()
      apiStoryMarkAsRead(story.id)
      stories.value = stories.value.map((s) => {
        return {
          ...s,
          is_read: s.is_read || s.id === story.id,
        }
      })
    } else {
      storyDialogRef.current?.close()
    }
  }, [story])

  return (
    <dialog
      className={'dialog-story-preview'}
      ref={storyDialogRef}
      onClick={(e) =>
        e.target === storyDialogRef.current && storyDialogRef.current?.close()
      }
    >
      {story && (
        <>
          <div className={'dialog-story-preview_actions'}>
            <a
              className={'button button--icon button--secondary'}
              href={story.link}
              target={'blank'}
            >
              <ExternalLink />
            </a>

            <Button
              className={'button--icon button--secondary'}
              type={'button'}
              onClick={() => handleStorySave()}
            >
              {bookmark ? <BookmarkMinus /> : <BookmarkPlus />}
            </Button>
          </div>

          <div className={'dialog-story-preview_scrollable'}>
            <h2 className={'dialog-story-preview_title'}>{story.title}</h2>

            <div className={'dialog-story-preview_info'}>
              {story.feed?.name}
              {' - '}
              {new Date(story.pub_date * 1000).toLocaleString()}
            </div>

            <div
              className={'dialog-story-preview_content'}
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </div>
        </>
      )}
    </dialog>
  )
}
