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
  const [playerWin, setPlayerWin] = useState(false)
  const [dealerWin, setDealerWin] = useState(false)

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
    setPlayerScore(calculateScore(newPlayerHand));

    const { data: { cards: newDealerHand } } = await axios.get(
      `https://deckofcardsapi.com/api/deck/${newDeckId}/draw/?count=2`
    );

    setDealerHand(newDealerHand);

  } catch (error) {
    console.error(error);
  }
}

  const getCardPoints = (card) => {
    let points = 0
    switch(card.value) {
      case 'ACE':
        points = 11
        break
      case 'KING':
      case 'QUEEN':
      case 'JACK':
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
      if (card.value === 'ACE') {
        if (score + 11 <= 21) {
          score = score + 11      
        } else {
          score = score + 1
        }
      }
      else {
        score = score + getCardPoints(card)
      } 
    }
    return score
  }
  const playHelper = () => {
    setGame(true)
    fetchNewDeck()
  }

  const hitHelper = () => {
    axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
      .then(response => {
        if (response.data) {
          const drawnCard = response.data.cards[0]
          setPlayerHand(prevPlayerHand => [...prevPlayerHand, drawnCard])
          const newPlayerScore = playerScore + getCardPoints(drawnCard)
          if (newPlayerScore > 21) {
            setDealerWin(true)
          } else if(newPlayerScore === 21) {
            setPlayerWin(true)
          }
          setPlayerScore(newPlayerScore)
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  const dealerTurnHelper = () => {
    setDealerTurn(true)
    let currentDealerScore = dealerScore
    while(currentDealerScore < 21) {
      axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
        .then(response => {
          if (response.data) {
            const drawnCard = response.data.cards[0]
            setDealerHand(prevDealerHand => [...prevDealerHand, drawnCard])
            if(drawnCard.value === 'ACE') {
              if (currentDealerScore + 11 <= 21) {
                currentDealerScore = currentDealerScore + 11
              } else {
                currentDealerScore = currentDealerScore + 1
              }
            } else {
              currentDealerScore = currentDealerScore + getCardPoints(drawnCard)
            }
            if (currentDealerScore > 21) {
              setPlayerWin(true)
            } else if(currentDealerScore === 21) {
              setDealerWin(true)
            }
            setDealerScore(currentDealerScore)
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  return (
    <div className="App">
      {!game && (
        <button className='start-button' onClick={playHelper}>PLAY</button>
      )}
      {game && !playerWin && !dealerWin && (
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
            <button className='game-button stand'onClick={dealerTurnHelper}>STAND</button>
          </div>
        </div>
      )}
      {playerWin && (
        <h1>YOU WIN!!</h1>
      )}
      {dealerWin && (
        <h1>DEALER WINS!!</h1>
      )}
    </div>
  );
}

export default App;
