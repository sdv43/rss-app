import { IFeed, IStory } from '../api'
import { IconFeed } from './IconFeed'

interface IProps {
  story: IStory & { feed?: IFeed }
  onClick: () => void
}

const formatDate = (date: number) => {
  const intl = new Intl.RelativeTimeFormat('en', { style: 'short' })
  const diff = date - Date.now() / 1000

  if (diff > -1 * 3600 * 24) {
    return intl.format(Math.round(diff / 3600), 'hour')
  } else if (diff > -1 * 3600 * 24 * 7) {
    return intl.format(Math.round(diff / 3600 / 24), 'day')
  } else if (diff > -1 * 3600 * 24 * 7 * 4) {
    return intl.format(Math.round(diff / 3600 / 24 / 7), 'week')
  } else {
    return new Intl.DateTimeFormat('en-US').format(date * 1000)
  }
}

export const StoryListItem = ({ story, onClick }: IProps) => {
  return (
    <a className={'story-list_item'} onClick={onClick}>
      <h2 className={'story-list_item-title'}>{story.title}</h2>
      <span className={'story-list_item-info'}>
        <span className={'story-list_item-info-feed'}>
          {story.feed?.icon_link ? (
            <img
              className={'story-list_item-info-feed-icon'}
              width={16}
              height={16}
              src={story.feed.icon_link}
              alt={story.feed.name}
            />
          ) : (
            <IconFeed width={16} height={16} />
          )}
          {story.feed?.name || 'Deleted feed'}
        </span>

        <span
          className={'story-list_item-date'}
          title={new Date(story.pub_date * 1000).toLocaleString()}
        >
          {formatDate(story.pub_date)}
        </span>
      </span>
    </a>
  )
}
