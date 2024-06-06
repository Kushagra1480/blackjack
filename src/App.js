import './App.css'
import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [game, setGame] = useState(false)
  const [dealerTurn, setDealerTurn] = useState(false)
  const [deckID, setDeckID] = useState('')
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [playerScore, setPlayerScore] = useState(0)
  const [dealerScore, setDealerScore] = useState(0)

  const cardBack = "https://deckofcardsapi.com/static/img/back.png"
  

const fetchNewDeck = async () => {
  try {
    const { data: { deck_id: newDeckId } } = await axios.get(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=4"
    );

    setDeckID(newDeckId)

    const { data: { cards: newPlayerHand } } = await axios.get(
      `https://deckofcardsapi.com/api/deck/${newDeckId}/draw/?count=2`
    );

    setPlayerHand(newPlayerHand)
    setPlayerScore(calculateScore(newPlayerHand))

    const { data: { cards: newDealerHand } } = await axios.get(
      `https://deckofcardsapi.com/api/deck/${newDeckId}/draw/?count=2`
    );

    setDealerHand(newDealerHand)

  } catch (error) {
    console.error(error)
  }
}

  const getCardPoints = (card) => {
    let points = 0
    switch(card.value) {
      case 'Ace':
        points = 11
        break
      case 'King':
      case 'Queen':
      case 'Jack':
        points = 10
        break
      default:
        points = parseInt(card.value)
    }
    return points
  }

  const calculateScore = (hand) => {
    let score = 0
    for(const card of hand) {
      score = score + getCardPoints(card)
    }
    return score
  }
  const playHelper = () => {
    setGame(true)
    fetchNewDeck()
  }

  const hitHelper = () => {
    const { data: { cards: newPlayerHand } } = axios.get(
      `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
    )
    setPlayerHand([...playerHand, ...newPlayerHand])
    setPlayerScore(calculateScore([...playerHand, ...newPlayerHand]))
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
            {dealerTurn && dealerHand.map((card, index) => 
              <img src={card.images.svg} className='hand-card'/>
            )}
            </div>
            {!dealerTurn && dealerHand.length > 0 && (
              <div className='dealer-hand'> 
                <img src={cardBack} className='hand-card back-card'/>
                <img src={dealerHand[1].images.svg} className='hard-card other-card'/>
              </div>
            )}  
          <h2>Your Hand:</h2>
          <div className='hand '>
            {playerHand.map((card, index) => 
              <img src={card.images.svg} className='hand-card'/>
            )}
            </div>
          </div>
          <div className='scores'>
            <h3>Player Score: {playerScore}</h3>
          </div>
          <div className='game-buttons'> 
            <button className='game-button' onClick={hitHelper}>HIT</button>
            <button className='game-button stand'>STAND</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
