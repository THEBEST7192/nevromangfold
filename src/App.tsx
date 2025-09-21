import React from 'react'
import './App.css'
import Header from './UI/Header'
import MainPage from './MainPage'
import blueVector from "./assets/blue.svg";
import yellowVector from "./assets/yellow.svg";

function App() {

  return (
    <div className="app-container">
      <Header />
      <MainPage />
      {/* <img src={blueVector} alt="Blue Vector" className="blue-vector" /> */}
      {/* <img src={yellowVector} alt="Yellow Vector" className="yellow-vector" /> */}
    </div>
  )
}

export default App
