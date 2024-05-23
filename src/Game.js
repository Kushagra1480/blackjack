class Card {
    constructor(suit, key, num) {
        this.suit = suit
        this.key = key
        this.num = num
    }
    show() {
        console.log(`${this.key} of ${this.suit}`)
        return this
    }
}

class Deck {
    constructor () {
        this.deck = []
        this.shuffle()
        const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
        const nums = {"Ace": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5, "Six": 6, "Seven": 7, "Eight": 8, "Nine": 9, "Ten": 10, "Jack": 11, "Queen": 12, "King": 13};
        for(let i = 0; i < suits.length(); ++i) {
            for(let key in nums) {
                this.deck.push(new Card(suits[i], key, nums[key]))
            }
        }
        return this
    }
    shuffle() {
        for(let i = this.deck.length - 1; i > 0; --i) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = this.deck[i]
            this.deck[i] = this.deck[j]
            this.deck[j] = temp
        }
        return this
    }
    deal() {
        let dealtCard = this.deck.pop()
        return dealtCard
    }
    resetDeck() {
        this.deck = []
        const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
        const nums = {"Ace": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5, "Six": 6, "Seven": 7, "Eight": 8, "Nine": 9, "Ten": 10, "Jack": 11, "Queen": 12, "King": 13};
        for (let i=0; i < suits.length; i++){
            for (let key in nums){
                this.deck.push(new Card(suits[i], key, nums[key]));
            }
        }
        this.shuffle();
        console.log("Deck reset. Cards have been shuffled.")
        return this;
    }
}