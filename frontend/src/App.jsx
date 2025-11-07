import { useState } from 'react'
import LoginPage from './assets/Components/LoginPage'
import CreateAccount from './assets/Components/CreateAccount'
import Landing from './assets/Components/Landing'
import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import HomePage from './assets/Components/HomePage'
import MyDeskPage from './assets/Components/MyDeskPage'
import CollaborationIdeas from './assets/Components/CollaborationIdeas'
import CollabLayout from './assets/Components/CollabLayout'
import GroupsList from './assets/Components/GroupsList'
import GeneralChat from './assets/Components/GeneralChat'
import Resources from './assets/Components/Resources'
import CollabResources from './assets/Components/CollabResources'
import Dashboard from './assets/Components/Dashboard'
import Tiers from './assets/Components/Tiers'

const router = createBrowserRouter(
  [
    {path:"/", element: <Landing/>},
    {path: "/signup", element: <CreateAccount/>},
    {path: "/login-page", element: <LoginPage/>},
    {path: "/home-page", element: <HomePage/>},
    {path: "/home-page/MyDeskPage", element: <MyDeskPage/>},
  {path: "/dashboard", element: <Dashboard/>},
  {path: "/tiers", element: <Tiers/>},
  {
    path: "/home-page/Collab",
    element: <CollabLayout />,
    children: [
      { index: true, element: <GroupsList /> },
      { path: 'resources', element: <CollabResources /> },
      { path: 'ideas', element: <CollaborationIdeas /> },
      { path: 'chat', element: <GeneralChat /> }
    ]
  },
    {path:"/resources", element: <Resources/>},
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
