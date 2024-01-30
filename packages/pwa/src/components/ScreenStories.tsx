import { useContext, useState } from 'preact/hooks'
import { ArrowDownUp } from 'lucide-preact'
import { TopBar } from './TopBar'
import { State } from '../store'
import { StoryList } from './StoryList'
import { Button } from './Button'

interface IProps {
  path: string
}

export const ScreenStories = (_props: IProps) => {
  const { stories } = useContext(State)
  const [filter, setFilter] = useState<'unread' | 'all'>('unread')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')

  const storiesSorted = stories.value
    .filter((s) => {
      if (filter === 'unread') {
        return !s.is_read
      }

      return true
    })
    .sort((a, b) => {
      if (a.pub_date < b.pub_date) return sort === 'asc' ? -1 : +1
      if (a.pub_date > b.pub_date) return sort === 'asc' ? +1 : -1

      return 0
    })

  return (
    <div>
      <TopBar title="Stories" />

      <div className={'story-list-filter'}>
        <div className={'type-filter'}>
          <label className={'button button--secondary type-filter_button'}>
            Unread
            <input
              type={'radio'}
              name="filter"
              checked={filter === 'unread'}
              onClick={() => setFilter('unread')}
            />
          </label>

          <label className={'button button--secondary type-filter_button'}>
            All
            <input
              type={'radio'}
              name="filter"
              checked={filter === 'all'}
              onClick={() => setFilter('all')}
            />
          </label>
        </div>

        <Button
          className={'button--icon button--secondary'}
          type={'button'}
          onClick={() => setSort((s) => (s === 'asc' ? 'desc' : 'asc'))}
        >
          <ArrowDownUp />
        </Button>
      </div>

      <StoryList stories={storiesSorted} />
    </div>
  )
}
