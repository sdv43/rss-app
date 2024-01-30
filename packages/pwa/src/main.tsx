import { render } from 'preact'
import { App } from './components/App.tsx'
import './assets/index.css'
import { State, createState } from './store.ts'

render(
  <State.Provider value={createState()}>
    <App />
  </State.Provider>,
  document.getElementById('app')!
)
