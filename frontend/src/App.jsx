import { useState } from 'react'
import LoginPage from './assets/Components/LoginPage'
import CreateAccount from './assets/Components/CreateAccount'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CreateAccount></CreateAccount>
    </>
  )
}

export default App
 