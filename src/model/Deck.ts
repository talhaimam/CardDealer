import { Card, Suite, Rank } from './Card'
import { v4 as uuidv4 } from 'uuid'
import { IShuffleService } from '../service/Shuffle.service.interface';
import { WithId } from 'mongodb';

// constants to build the deck
const validSuites: Suite[] = ["HEARTS", "SPADES", "DIAMONDS", "CLUBS"];
const validRanks36: Rank[] = ["ACE", "KING", "QUEEN", "JACK", "10", "9", "8", "7", "6"];
const validRanks52: Rank[] = ["ACE", "KING", "QUEEN", "JACK", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

export type typeOfDeck = "FULL" | "SHORT";

export class Deck {
  public cards: Card[] = [];
  public cardsDrawn: Card[] = [];
  public deckId: string;
  public type: typeOfDeck;
  public remaining: number;
  public shuffled: boolean = false;

  constructor(type: typeOfDeck) {
    this.type = type;
    this.deckId = uuidv4(); //fetch a new uuid
    this.buildDeck(); //build the deck in order
    this.remaining = this.cards.length;
  }


  buildDeck() {
    this.cards = []; // reset deck
    this.cardsDrawn = []; // reset cards drawn

    const validRanks = this.type == "SHORT" ? validRanks36 : validRanks52;
    validSuites.forEach(suite => {    // build deck cycle
      validRanks.forEach(rank => {
        this.cards.push(new Card(rank, suite));
      })
    });
  }
  shuffle(shuffleService: IShuffleService) {
    this.cards = shuffleService.shuffle(this.cards); //shuffle cards using the shuffle service
    this.shuffled = true;
  }

  drawCard(count: number) {
    if (!this.isEmpty()) {
      let cardsToReturn: Card[] = [];

      while (!this.isEmpty() && count > 0) {
        const cardFromTop = this.cards.shift(); //picking up the cards from top
        if (cardFromTop) {
          cardsToReturn.push(cardFromTop);
        }
        count--;
      }

      this.cardsDrawn = this.cardsDrawn.concat(cardsToReturn);
      return cardsToReturn;
    }

    return []; //return an empty array if all cards have been drawn
  }

  isEmpty() { //to check the length of the cards array
    return this.cards.length === 0;
  }
}

export function copyIntoDeck(obj: any){ //to clone json requests into deck object
  let clone = new Deck(obj.type);

  if(obj){
      clone.cards = obj.cards;
      clone.cardsDrawn = obj.cardsDrawn;
      clone.deckId = obj.deckId;
      clone.remaining = obj.remaining;
      clone.shuffled = obj.shuffled;
      clone.type = obj.type;
  }

  return clone;
}