import './assets/main.css'

declare global {
  interface Window {
    api: {
      fetchSchedules: () => Promise<{ schedules: Response[]; index: number }>
    }
  }
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Response } from './function/eventTransform'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
