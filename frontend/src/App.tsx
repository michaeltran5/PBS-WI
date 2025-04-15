import './App.css'

import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Browse from './pages/Browse'
import MediaPlayer from './pages/MediaPlayer'
import ProtectedRoute from './components/ProtectedRoute'

import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalStyles } from './GlobalStyles';
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { AuthProvider } from './components/AuthContext'


function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <GlobalStyles />
            <Header />
            <Routes>
              <Route path="/" element={<Browse />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/watch" element={<MediaPlayer />} />
              <Route path="/watch/:showId" element={<MediaPlayer />} />
              <Route path="/my-list" element={
                <ProtectedRoute>
                  <Browse />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  )
}

export default App