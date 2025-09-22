import { useState } from 'react'
import LoginPage from './assets/Components/LoginPage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LoginPage></LoginPage>
    </>
  )
}

export default App
