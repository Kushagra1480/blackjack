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
  return (
    <div className="App">
      <button className="start-button" onClick={dealCards}>DEAL CARDS</button>
      {dealerHand.length > 0 && (
        <div>
        <h2>Dealer's Hand:</h2>
        <ul>
          {dealerHand.map((card, index) => (
              <li key={index}>{card.value} of {card.suit}</li>
          ))}
        </ul>
      </div>
      )}
      {playerHand.length > 0 && (
        <div>
          <h2>Your Hand:</h2>
          <ul>
            {playerHand.map((card, index) => (
                <li key={index}>{card.value} of {card.suit}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
