export type Suite = "HEARTS" | "SPADES" | "DIAMONDS" | "CLUBS"; 
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "JACK" | "QUEEN" | "KING" | "ACE";

export const valueCards = {
  2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, JACK:11, QUEEN: 12, KING: 13, ACE: 14
}

//the card class
export class Card {
  public rank: Rank;
  public suite: Suite;
  public value: number;
  public code: string="";

  constructor(rank: Rank, suite: Suite) {
    this.rank = rank;
    this.suite = suite;
    this.code = this.rank === "10" ? this.rank + suite[0] : this.rank[0] + suite[0]; //Apart from the 10 card, all cards could be denoted by a single symbol
    this.value = valueCards[rank];
  }

  isSameCard = (otherCard: Card) => { //this is one of the tests I implemented, could have implemented more but I chose my battles
    if (this.value === otherCard.value && this.suite === otherCard.suite) {
      return true;
    }

    return false;
  }
}
