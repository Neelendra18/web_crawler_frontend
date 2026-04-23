import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CrawlerPage from '@pages/CrawlerPage'
import { ErrorBoundary } from '@components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CrawlerPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
