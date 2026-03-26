import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { enableMocking } from '@/mocks/enableMocking.ts'

import App from './App'

await enableMocking()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
