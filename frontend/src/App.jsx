import { useState } from 'react'
import LoginPage from './assets/Components/LoginPage'
import CreateAccount from './assets/Components/CreateAccount'
import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import HomePage from './assets/Components/HomePage'

const router = createBrowserRouter(
  [
    {path:"/", element: <CreateAccount/>},
    {path: "/login-page", element: <LoginPage/>},
    {path: "/home-page", element: <HomePage/>},
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
 