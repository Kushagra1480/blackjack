import './App.css'
import React, { useState } from 'react'


function App() {
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])

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
  }
  return (
    <div className="App">
      {dealerHand.length == 0 && (
        <button className="start-button" onClick={dealCards}>DEAL CARDS</button>
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
