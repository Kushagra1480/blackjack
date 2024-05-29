import './App.css'
import React, { useState } from 'react'


function App() {
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [playerScore, setPlayerScore] = useState(0)
  const [dealerScore, setDealerScore] = useState(0)
  const [playerWin, setPlayerWin] = useState(false)
  const [dealerWin, setDealerWin] = useState(false)


  const createDeck = () => {
    const suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs']
    const values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King']
    const newDeck = suits.flatMap(suit => values.map(value => ({suit, value})))
    setDeck(newDeck)
  }

  const dealCards = () => {
    if (deck.length < 2) {
      alert("Empty Deck!! Initialize a Deck first!!")
      return 
    }
    const shuffleDeck = [...deck].sort(() => Math.random() - 0.5)
    const dealtCards = shuffleDeck.slice(0, 2)
    const dealerCards = shuffleDeck.slice(2, 4)
    setDeck(shuffleDeck.slice(2))
    setPlayerHand(dealtCards)
    setDealerHand(dealerCards)
    setPlayerScore(calculateScore(dealtCards))
  }
  const calculateScore = (hand) => {
    let score = 0
    let hasAce = false
    for (const card of hand) {
      switch(card.value) {
        case 'Ace':
          score += 11
          hasAce = true
          break
        case 'King':
        case 'Queen':
        case 'Jack':
          score += 10
          break
        default:
          score += parseInt(card.value)
      }
    }
    while (score > 21 && hasAce) {
      score -= 10
      hasAce = false
    }
    if (score === 21) {
      setPlayerWin(true)
    }
    if (score > 21) {
      setDealerWin(true)
    }
    return score 
  }
  React.useEffect(() => {
    createDeck();
  }, [])
  const resetGame = () => {
    setDealerHand([])
    setPlayerHand([])
  }
  const hit = () => {
    const randomIndex = Math.floor(Math.random() * deck.length)
    const dealtCard = deck.splice(randomIndex, 1)[0]
    setPlayerHand([...playerHand, dealtCard])
    setPlayerScore(calculateScore([...playerHand, dealtCard]))
  }
  return (
    <div className="App">
      {dealerHand.length == 0 && (
        <button className="start-button" onClick={dealCards}>START GAME</button>
      )}
      {dealerHand.length > 0 && (
        <div className='game'>
        <h2>Dealer's Hand:</h2>
        <ul>
          <li key={0}>{dealerHand[0].value} of {dealerHand[0].suit}</li>
          <li>Face Down Card</li>
        </ul>
        <h2>Your Hand:</h2>
        <ul>
          {playerHand.map((card, index) => (
              <li key={index}>{card.value} of {card.suit}</li>
          ))}
        </ul>
        <h4>Score: {playerScore}</h4>
        <div className='game-buttons'>
          <button onClick={hit}>Hit</button>
          <button>Stand</button>
        </div>
        <br />
        <button className='start-button' onClick={resetGame}>RETVRN</button>
      </div>
      )}
    </div>
  );
}

export default App;
