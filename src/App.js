import './App.css'
import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [game, setGame] = useState(false)
  const [deckID, setDeckID] = useState('')
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  
  const getNewDeck = async () => {
    try {
      const response = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=4")
      const newDeckID = response.data.deck_id
      setDeckID(newDeckID)
      console.log("Deck ID: ", newDeckID)
      const playerHandResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${newDeckID}/draw/?count=2`)
      const newPlayerHand = playerHandResponse.data.cards
      setPlayerHand(newPlayerHand)
      const dealerHandResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${newDeckID}/draw/?count=2`)
      const newDealerHand = dealerHandResponse.data.cards
      setDealerHand(newDealerHand)
    } catch (e) {
      console.error(e)
    }
  } 

  const playHelper = () => {
    setGame(true)
    getNewDeck()
  }

  return (
    <div className="App">
      {!game && (
        <button className='start-button' onClick={playHelper}>PLAY</button>
      )}
      {game && (
        <div className='game'>
          <div className='hands'>
          <h2>Dealer's Hand:</h2>
            <div className='hand'>
            {dealerHand.map((card, index) => 
              <img src={card.images.svg} className='hand-card'/>
            )}
            </div>
          <h2>Your Hand:</h2>
          <div className='hand'>
            {playerHand.map((card, index) => 
              <img src={card.images.svg} className='hand-card'/>
            )}
            </div>
          </div>
          <div className='game-buttons'> 
            <button className='game-button'>Hit</button>
            <button className='game-button stand'>Stand</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
