import { useState } from 'react'
import LoginPage from './assets/Components/LoginPage'
import CreateAccount from './assets/Components/CreateAccount'
import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter(
  [
    {path:"/", element: <CreateAccount/>},
    {path: "/login-page", element: <LoginPage/>},
  ]
);

function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
 