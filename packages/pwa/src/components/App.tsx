import { useState, useContext, useEffect } from 'preact/hooks'
import { Router, route, getCurrentUrl } from 'preact-router'
import { ScreenStories } from './ScreenStories'
import { ScreenFeeds } from './ScreenFeeds'
import { ScreenBookmarks } from './ScreenBookmarks'
import { ScreenAccount } from './ScreenAccount'
import { BottomBar } from './BottomBar'
import { ScreenSignIn } from './ScreenSignIn'
import { State } from '../store'
import { cl } from '../utils'
import { UnauthorizedError } from '../api'
import { Loader } from './Loader'

export function App() {
  const { settings, isLoading, loadData } = useContext(State)
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true)

  const handleRouteChange: Router['props']['onChange'] = (event) => {
    setIsBottomBarVisible(event.url !== '/sign-in')
  }

  useEffect(() => {
    if (settings.value || getCurrentUrl() === '/sign-in') {
      return
    }

    isLoading.value = true

    loadData()
      .catch((error) => {
        if (error instanceof UnauthorizedError) {
          route('/sign-in', true)
        } else {
          alert(error)
        }
      })
      .finally(() => {
        isLoading.value = false
      })
  }, [])

  return (
    <>
      <div
        className={cl(
          'screen-container',
          isLoading.value && 'in-loading',
          import.meta.env.MODE === 'development' && 'development-mode'
        )}
      >
        <Router onChange={handleRouteChange}>
          <ScreenStories path="/stories" />
          <ScreenFeeds path="/feeds" />
          <ScreenBookmarks path="/bookmarks" />
          <ScreenAccount path="/account" />
          <ScreenSignIn path="/sign-in" />
        </Router>
      </div>
      {isBottomBarVisible && <BottomBar />}
      {isLoading.value && <Loader />}
    </>
  )
}
