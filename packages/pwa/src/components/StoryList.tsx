import { useContext, useState } from 'preact/hooks'
import { ComponentProps } from 'preact'
import { IFeed, IStory } from '../api'
import { State } from '../store'
import { StoryListItem } from './StoryListItem'
import { StoryListItemPreview } from './StoryListItemPreview'
import { cl } from '../utils'

interface IProps extends ComponentProps<'div'> {
  stories: IStory[]
}

export const StoryList = ({ stories, className, ...props }: IProps) => {
  const { feeds } = useContext(State)
  const [activeStory, setActiveStory] = useState<IStoryLocal | undefined>()

  const storiesPrepared = stories.map((s) => {
    return {
      ...s,
      feed: feeds.value.find((f) => f.id === s.feed_id) as IFeed,
    }
  })

  type IStoryLocal = (typeof storiesPrepared)[0]

  const handleStoryClick = (story: IStoryLocal) => {
    setActiveStory(story)
  }

  return (
    <>
      <div {...props} className={cl(className, 'story-list')}>
        {storiesPrepared.map((story) => {
          return (
            <StoryListItem
              key={story.id}
              story={story}
              onClick={() => handleStoryClick(story)}
            />
          )
        })}
      </div>

      <StoryListItemPreview story={activeStory} />
    </>
  )
}
