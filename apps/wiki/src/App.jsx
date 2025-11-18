import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WikiLayout from './components/WikiLayout.jsx'
import WikiHome from './pages/WikiHome.jsx'
import WikiArticle from './pages/WikiArticle.jsx'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<WikiLayout />}>
        <Route index element={<WikiHome />} />
        <Route path="page/:pageSlug" element={<WikiArticle />} />
        <Route path="*" element={<WikiHome />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default App
