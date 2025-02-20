import './App.css'
import ExploreHeader from './components/ExploreHeader'
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'
import Browse from './pages/Browse'
import Live from './pages/Live'
import MyList from './pages/MyList'
import BrowseGenre from './pages/BrowseGenre'

function App() {

  return (
    <div className="app-container">
      <BrowserRouter>
        <div>
          <ExploreHeader/>
            <Routes>
            <Route path="/pages/browse" element={<Browse/>}/>
            <Route path="/pages/live" element={<Live/>}/>
            <Route path="/pages/mylist" element={<MyList/>}/>
            <Route path="/pages/browsegenre" element={<BrowseGenre/>}/>
          </Routes>
        </div>
      </BrowserRouter>
      </div>
  )
}

export default App
