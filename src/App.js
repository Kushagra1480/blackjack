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
  const [stand, setStand] = useState(false)

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
    setDealerScore(calculateScore(dealerCards))
  }
  const calculateScore = (hand, owner) => {
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
      switch(owner) {
        case "player":
          setPlayerWin(true)
          break
        case "dealer":
          setDealerWin(true)
      }
    }
    if (score > 21) {
      switch(owner) {
        case "player":
          setDealerWin(true)
          break
        case "dealer":
          setPlayerWin(true)
      }
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
    const newHand = [...playerHand, dealtCard]
    setPlayerHand(newHand)
    setPlayerScore(calculateScore(newHand, "player"))
  }
  const standHelper = () => {
    setStand(true);
    let updatedDealerHand = [...dealerHand]; // Create a copy of dealerHand
    let score = dealerScore

    while (score < 21 && deck.length > 0) {
      const randomIndex = Math.floor(Math.random() * deck.length)
      const dealtCard = deck.splice(randomIndex, 1)[0]
      updatedDealerHand = [...updatedDealerHand, dealtCard]
      score = calculateScore(updatedDealerHand, "dealer")
      console.log("Score: ", score)
    }
    setDealerScore(score)
    if (score > 21) {
      setPlayerWin(true);
    } else if (playerScore > score) {
      setPlayerWin(true);
    } else if (playerScore < score) {
      setDealerWin(true);
    }
  }
  return (
    <div className="App">
      {dealerHand.length == 0 && (
        <button className="start-button" onClick={dealCards}>START GAME</button>
      )}
      {dealerHand.length && !playerWin && !dealerWin > 0 && (
        <div className='game'>
          <div className='hands'>
              <h2>Dealer's Hand:</h2>
              {!stand && (
                <ul>
                  <li key={0}>{dealerHand[0].value} of {dealerHand[0].suit}</li>
                  <li>Face Down Card</li>
                </ul>
              ) }
              {
                stand && (
                  <ul>
                    {dealerHand.map((card, index) => (
                        <li key={index}>{card.value} of {card.suit}</li>
                    ))}
                  </ul>
                )
              }
            <h2>Your Hand:</h2>
            <ul>
              {playerHand.map((card, index) => (
                  <li key={index}>{card.value} of {card.suit}</li>
              ))}
            </ul>
          </div>
        <h4>Score: {playerScore}</h4>
        <div className='game-buttons'>
          <button onClick={hit} className='game-button'>HIT</button>
          <button onClick={standHelper} className='game-button stand'>STAND</button>
        </div>
      </div>
      )}
      {playerWin && (
        <div className='game'>
          <h1>Player Wins!!</h1>
          <h4>Player Score: {playerScore}</h4>
          <h4>Dealer Score: {dealerScore}</h4>
        </div>
      )}
      {dealerWin && (
        <div className='game'>
          <h1>Dealer Wins!!</h1>
          <h4>Player Score: {playerScore}</h4>
          <h4>Dealer Score: {dealerScore}</h4>
        </div>
      )}
    </div>
  );
}

export default App;
