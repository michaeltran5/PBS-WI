import './App.css'

import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Browse from './pages/Browse'
import MediaPlayer from './pages/MediaPlayer'

import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalStyles } from './GlobalStyles';
import { Provider } from 'react-redux'
import { store } from './redux/store'


function App() {

  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <GlobalStyles />
          <Header />
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/watch" element={<MediaPlayer />} />
            <Route path="/watch/:showId" element={<MediaPlayer />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App