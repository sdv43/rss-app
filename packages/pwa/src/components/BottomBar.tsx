import { Link } from 'preact-router/match'
import { Newspaper, Bookmark, Rss, User } from 'lucide-preact'

interface IProps {}

export const BottomBar = ({}: IProps) => {
  return (
    <nav className={'bottom-bar'}>
      <Link
        className={'bottom-bar_item'}
        activeClassName="bottom-bar_item--selected"
        href={'/stories'}
      >
        <Newspaper />
      </Link>
      <Link
        className={'bottom-bar_item'}
        activeClassName="bottom-bar_item--selected"
        href={'/bookmarks'}
      >
        <Bookmark />
      </Link>
      <Link
        className={'bottom-bar_item'}
        activeClassName="bottom-bar_item--selected"
        href={'/feeds'}
      >
        <Rss />
      </Link>
      <Link
        className={'bottom-bar_item'}
        activeClassName="bottom-bar_item--selected"
        href={'/account'}
      >
        <User />
      </Link>
    </nav>
  )
}
