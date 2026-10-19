import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/zcool-kuaile/latin-400.css'
import '@fontsource/zcool-kuaile/chinese-simplified-400.css'
import '@fontsource/noto-sans-sc/latin-400.css'
import '@fontsource/noto-sans-sc/latin-700.css'
import '@fontsource/noto-sans-sc/chinese-simplified-400.css'
import '@fontsource/noto-sans-sc/chinese-simplified-700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
