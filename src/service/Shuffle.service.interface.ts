import { Card } from '../model/Card';

export interface IShuffleService {
  shuffle (cards: Card[]): Card[];
}