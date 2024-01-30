import { useContext } from 'preact/hooks'
import { TopBar } from './TopBar'
import { State } from '../store'
import { StoryList } from './StoryList'

interface IProps {
  path: string
}

export const ScreenBookmarks = (_props: IProps) => {
  const { bookmarks } = useContext(State)

  return (
    <div>
      <TopBar title="Bookmarks" />
      <StoryList stories={bookmarks.value} />
    </div>
  )
}
