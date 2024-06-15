import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { StateContextProvider } from './context'
import './index.css'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { clientId } from './client'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThirdwebProvider clientId={clientId} activeChain="sepolia">
      <Router>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </Router>
    </ThirdwebProvider>
  </React.StrictMode>,
)
