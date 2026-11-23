import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'
import Gate from './pages/Gate'
import Cake from './pages/Cake'
import Memories from './pages/Memories'
import Letter from './pages/Letter'
import Finale from './pages/Finale'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Gate /></PageTransition>} />
        <Route path="/cake" element={<PageTransition><Cake /></PageTransition>} />
        <Route path="/memories" element={<PageTransition><Memories /></PageTransition>} />
        <Route path="/letter" element={<PageTransition><Letter /></PageTransition>} />
        <Route path="/finale" element={<PageTransition><Finale /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}