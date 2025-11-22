import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WikiLayout from './components/WikiLayout.jsx'
import WikiHome from './pages/WikiHome.jsx'
import WikiArticle from './pages/WikiArticle.jsx'
import WikiInput from './pages/WikiInput.jsx'
import WikiComposer from './pages/WikiComposer.jsx'
import WikiMedia from './pages/WikiMedia.jsx'
import WikiDatabases from './pages/WikiDatabases.jsx'
import WikiDatabaseDetail from './pages/WikiDatabaseDetail.jsx'
import WikiDatabasePage from './pages/WikiDatabasePage.jsx'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<WikiLayout />}>
        <Route index element={<WikiHome />} />
        <Route path="page/:pageSlug" element={<WikiArticle />} />
        <Route path="input" element={<WikiInput />} />
        <Route path="new" element={<WikiComposer />} />
        <Route path="media" element={<WikiMedia />} />
        <Route path="databases" element={<WikiDatabases />} />
        <Route path="database/:databaseId" element={<WikiDatabaseDetail />} />
        <Route path="database/:databaseId/page/:pageId" element={<WikiDatabasePage />} />
        <Route path="*" element={<WikiHome />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default App
