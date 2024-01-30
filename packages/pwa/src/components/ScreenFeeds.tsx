import { useContext, useRef, useState } from 'preact/hooks'
import { Pencil, X } from 'lucide-preact'
import { TopBar } from './TopBar'
import { State } from '../store'
import {
  IFeed,
  apiFeedCreate,
  apiFeedGet,
  apiFeedDelete,
  apiFeedUpdate,
  apiFeedCheck,
} from '../api'
import { IconFeed } from './IconFeed'
import debounce from 'debounce'
import { ComponentProps } from 'preact'
import { UNKNOWN_ERROR_MESSAGE } from '../constants'
import { cl } from '../utils'
import { Button } from './Button'

interface IProps {
  path: string
}

const callDebouncly = debounce((cl: () => void) => cl(), 2000)

export const ScreenFeeds = (_props: IProps) => {
  const deleteDialogRef = useRef<HTMLDialogElement>(null)
  const editDialogRef = useRef<HTMLDialogElement>(null)
  const { feeds } = useContext(State)
  const [isFeedInfoLoading, setIsFeedInfoLoading] = useState(false)
  const [activeFeed, setActiveFeed] = useState<IFeed | undefined>()
  const [editFeedForm, setEditFeedForm] = useState<{
    link: string
    name: string
  }>({ link: '', name: '' })
  const [feedInfo, setFeedInfo] = useState<
    Awaited<ReturnType<typeof apiFeedCheck>> | string | undefined
  >()

  const handleDeleteModal = (id: IFeed['id']) => {
    deleteDialogRef.current?.showModal()
    setActiveFeed(feeds.value.find((f) => f.id === id))
  }

  const handleEditModal = (id: IFeed['id']) => {
    const feed = feeds.value.find((f) => f.id === id)
    editDialogRef.current?.showModal()
    setFeedInfo(undefined)
    setActiveFeed(feed)

    setEditFeedForm({
      name: feed?.name ?? '',
      link: feed?.link ?? '',
    })
  }

  const handleDeleteModalDelete = async () => {
    if (activeFeed?.id) {
      try {
        await apiFeedDelete(activeFeed.id)
        feeds.value = await apiFeedGet()
      } catch (error) {
        alert(error)
      }
    }

    deleteDialogRef.current?.close()
  }

  const handleEditModalSave = async () => {
    try {
      let icon_link = activeFeed?.icon_link

      if (typeof feedInfo === 'object') {
        icon_link = feedInfo.icon_link ?? undefined
      }

      if (activeFeed) {
        await apiFeedUpdate({
          id: activeFeed.id,
          name: editFeedForm.name,
          link: editFeedForm.link,
          icon_link,
        })
      } else {
        await apiFeedCreate({
          name: editFeedForm.name,
          link: editFeedForm.link,
          icon_link,
        })
      }

      feeds.value = await apiFeedGet()
      editDialogRef.current?.close()
    } catch (error) {
      alert(error)
    }
  }

  const handleDeleteModalCancel = () => {
    deleteDialogRef.current?.close()
  }

  const handleEditModalLinkInput: ComponentProps<'input'>['onInput'] = (e) => {
    const link = (e.target as HTMLInputElement).value

    setEditFeedForm({
      ...editFeedForm,
      link,
    })

    callDebouncly(async () => {
      try {
        setIsFeedInfoLoading(true)

        const info = await apiFeedCheck(link)

        setFeedInfo(info)
        setEditFeedForm({
          link,
          name: info.name,
        })
      } catch (error) {
        if ('message' in (error as Error)) {
          setFeedInfo((error as Error).message)
        } else {
          setFeedInfo(UNKNOWN_ERROR_MESSAGE)
        }
      } finally {
        setIsFeedInfoLoading(false)
      }
    })
  }

  return (
    <div>
      <TopBar
        title="Feeds"
        actions={
          <Button type={'button'} onClick={() => handleEditModal(0)}>
            Add feed
          </Button>
        }
      />

      <div className={'feed-list'}>
        {feeds.value.map((feed) => {
          return (
            <a className={'feed-list_item'} key={feed.id}>
              <span className={'feed-list_item-name-wrapper'}>
                {feed.icon_link ? (
                  <img
                    className={'story-list_item-info-feed-icon'}
                    width={20}
                    height={20}
                    src={feed.icon_link}
                    alt={feed.name}
                  />
                ) : (
                  <IconFeed width={20} height={20} />
                )}

                <h2 className={'feed-list_item-name'}>{feed.name}</h2>
              </span>

              <span className={'feed-list_item-actions'}>
                <Button
                  className={'button--icon button--ghost feed-list_item-action'}
                  type={'button'}
                  onClick={() => handleEditModal(feed.id)}
                >
                  <Pencil />
                </Button>

                <Button
                  className={'button--icon button--ghost feed-list_item-action'}
                  type={'button'}
                  onClick={() => handleDeleteModal(feed.id)}
                >
                  <X />
                </Button>
              </span>
            </a>
          )
        })}
      </div>

      <dialog
        className={'dialog-alert'}
        ref={deleteDialogRef}
        onClick={(e) =>
          e.target === deleteDialogRef.current &&
          deleteDialogRef.current?.close()
        }
      >
        <p className={'dialog-alert_text'}>
          Do you really want to remove the feed "{activeFeed?.name}"?
        </p>

        <div className={'dialog-alert_actions'}>
          <button
            className={'button button--ghost'}
            type={'button'}
            onClick={handleDeleteModalCancel}
          >
            Cancel
          </button>
          <button
            className={'button button--ghost'}
            type={'button'}
            onClick={handleDeleteModalDelete}
          >
            Remove
          </button>
        </div>
      </dialog>

      <dialog
        className={'dialog-feed-edit'}
        ref={editDialogRef}
        onClick={(e) =>
          e.target === editDialogRef.current && editDialogRef.current?.close()
        }
      >
        <header className={'dialog-feed-edit_header'}>
          <h2 className={'dialog-feed-edit_title'}>
            {activeFeed ? 'Edit' : 'New'} feed
          </h2>

          <button
            className={'button'}
            type={'button'}
            disabled={
              (!activeFeed && typeof feedInfo !== 'object') ||
              (activeFeed && typeof feedInfo === 'string')
            }
            onClick={() => handleEditModalSave()}
          >
            Save
          </button>
        </header>

        <form className={'form dialog-feed-edit_form'}>
          <label className={'form-control'}>
            <span className={'form-control_label'}>RSS Link</span>
            <input
              className={'input form-control_input'}
              type={'text'}
              value={editFeedForm.link}
              onInput={handleEditModalLinkInput}
            />
          </label>

          <label className={'form-control'}>
            <span className={'form-control_label'}>Feed name</span>
            <input
              className={'input form-control_input'}
              type={'text'}
              value={editFeedForm.name}
              onInput={(e) =>
                setEditFeedForm({
                  ...editFeedForm,
                  name: (e.target as HTMLInputElement).value,
                })
              }
            />
          </label>

          {feedInfo && (
            <div
              className={cl(
                'feed-check-result',
                typeof feedInfo === 'string' && 'feed-check-result--error',
                isFeedInfoLoading && 'feed-check-result--loading'
              )}
            >
              <h4 className={'feed-check-result_title'}>Feed check result:</h4>
              <p className={'feed-check-result_msg'}>
                {typeof feedInfo === 'object'
                  ? 'The feed was parsed successfully!'
                  : feedInfo}
              </p>
            </div>
          )}
        </form>
      </dialog>
    </div>
  )
}
