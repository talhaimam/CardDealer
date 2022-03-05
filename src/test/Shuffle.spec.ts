import test from 'ava';
import { Card, Rank, Suite } from '../model/Card';
import {
    DurstenfeldShuffleService
} from '../service/DurstenfeldShuffle.service';

test('does shuffle', async t => {
    const service = new DurstenfeldShuffleService();
    const staticCards: Card[] = [
        new Card("2", "HEARTS"),
        new Card("2", "HEARTS"),
        new Card("3", "HEARTS"),
        new Card("4", "HEARTS"),
        new Card("5", "HEARTS"),
        new Card("6", "HEARTS"),
        new Card("7", "HEARTS"),
        new Card("8", "HEARTS"),
        new Card("9", "HEARTS"),
        new Card("10", "HEARTS"),
        new Card("JACK", "HEARTS"),
        new Card("QUEEN", "HEARTS"),
        new Card("KING", "HEARTS"),
        new Card("ACE", "HEARTS")
    ];
    const shuffledCards = service.shuffle([...staticCards]);
    let allEquivalent = true;
    for (let i = 0; i < shuffledCards.length; i++) {
        if (!staticCards[i].isSameCard(shuffledCards[i])) {
            allEquivalent = false;
            break;
        }
    }
    t.false(allEquivalent);
});

test('will error on less than 2 cards', async t => {
    const service = new DurstenfeldShuffleService();
    const cardsToShuffle: Card[] = [
        new Card("ACE", "HEARTS")
    ];
    try {
        service.shuffle(cardsToShuffle);
        t.fail('Error should have thrown');
    } catch (err: any) {
        t.deepEqual(err.message, 'Not enough cards to shuffle');
    }
});