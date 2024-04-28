import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Client from './pages/Client'
import Livre from './pages/Livre'
import Emprunt from './pages/Emprunt'
import SidBar from './components/SidBar'


function App() {
  

  return (
    <>
     <SidBar />
     
     <Routes>
        <Route path='/' element = {<Home />} />
        <Route path='/clients' element = {<Client />} />
        <Route path='/livres' element = {<Livre />} />
        <Route path='/emprunts' element = {<Emprunt />} />
      </Routes>
    
    </>
  )
}

export default App
