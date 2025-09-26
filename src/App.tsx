import './App.css'
import Header from './UI/Header'
import MainPage from './MainPage'
import DonationButton from './DonationButton' 

function App() {

  return (
    <div className="app-container">
      <Header />
      <MainPage />
      <DonationButton /> 
    </div>
  )
}

export default App
