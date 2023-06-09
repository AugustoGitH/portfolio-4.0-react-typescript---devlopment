import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { queryClient } from './services/queryClient'
import { QueryClientProvider } from 'react-query';


import { BrowserRouter as Router } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Router>
)
