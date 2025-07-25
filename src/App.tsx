import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home/Home'
import About from '@/pages/About/About'
import Projects from '@/pages/Projects/Projects'
import Contact from '@/pages/Contact/Contact'
import Dashboard from '@/pages/Dashboard/Dashboard'

function App() {
  const { isDark } = useThemeStore()

  React.useEffect(() => {
    // 应用主题到 HTML 元素
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'dark' : ''
    }`}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App