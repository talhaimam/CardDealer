import { Request, Response, NextFunction, request } from 'express';
import { Deck, copyIntoDeck } from '../model/Deck';
import { DurstenfeldShuffleService } from '../service/DurstenfeldShuffle.service';
import { Card } from '../model/Card';
import { collections } from './data';

// creating a new deck
export const create = async (req: Request, res: Response, next: NextFunction) => {

    //validations on parameters
    if (req.body.type == undefined || null) {
        return res.status(404).json({
            error: "Please include a deck type (short or full) to create a deck."
        });
    }

    if (req.body.shuffled == undefined || null) {
        return res.status(404).json({
            error: "Please pass true or false for the deck to be shuffled or unshuffled."
        });
    }

    //creating a new deck based on the request type(short or full)
    let deck = new Deck(req.body.type);

    if (req.body.shuffled) //shuffle the deck before saving if shuffling is required
        deck.shuffle(new DurstenfeldShuffleService());

    try {
        if (collections.Decks) {
            const result = await collections.Decks.insertOne({ deck });

            result ? res.status(200).json({ //returning the deck details as we've got this far
                deckId: deck.deckId,
                shuffled: deck.shuffled,
                type: deck.type,
                remaining: deck.remaining
            })

                : res.status(500).json({ "error": "Failed to create a new deck." }); //or returning an error if result fails
        }
    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
};

// opening a deck
export const open = async (req: Request, res: Response, next: NextFunction) => {

    if (req.body.deckId == undefined || null) {
        return res.status(404).json({
            error: "Please include a UUID value in your request in order to open a deck."
        });
    }

    const query = { "deck.deckId": req.body.deckId }; //query for fetching the respective document
    let response = null;

    if (collections.Decks) {
        response = await collections.Decks.findOne(query);

        if (!response) {
            return res.status(404).json({
                error: "Invalid UUID. Provide a valid deck UUID to open the deck"
            });
        }

        //if we've got this far, the response is valid, sending it back
        return res.status(200).json({
            deckId: response.deck.deckId,
            shuffled: response.deck.shuffled,
            type: response.deck.type,
            remaining: response.deck.remaining,
            cards: response.deck.cards
        });
    }
    else {
        return res.status(404).json({
            error: "The deck collection doesnt exist. Create a deck first"
        });
    }
};

// drawing a card
export const draw = async (req: Request, res: Response, next: NextFunction) => {

    if (req.body.deckId == undefined || null) {
        return res.status(404).json({
            error: "Please include a UUID value in your request in order to draw from a deck."
        });
    }

    if (req.body.count == undefined || null) {
        return res.status(404).json({
            error: "Please include the number of cards you'd like to draw."
        });
    }

    const query = { "deck.deckId": req.body.deckId };

    if (collections.Decks) {
        const response = await collections.Decks.findOne(query);

        if (response) {
            let deck = copyIntoDeck(response.deck); //creating a deck object from the retrieved document

            if (deck) {
                let cardsToReturn: Card[] = deck.drawCard(req.body.count); //draw the number of cards as required

                deck.cards = deck.cards.filter(n => !cardsToReturn.includes(n)); //filter the remaining cards by excluding the drawn cards
                deck.remaining = deck.remaining - cardsToReturn.length;
                deck.cardsDrawn = cardsToReturn;

                const result = await collections.Decks.updateOne(query, 
                    { $set: { "deck.cards" : deck.cards, "deck.remaining" : deck.remaining, "deck.cardsDrawn" : deck.cardsDrawn  } });

                if (!result) {
                    return res.status(500).json({
                        error: "Deck wasn't updated in the database."
                    });
                }

                return res.status(200).json({
                    cards: cardsToReturn
                });
            }
        }
        else {
            return res.status(404).json({
                error: "Invalid UUID. Provide a valid deck UUID to draw from the deck"
            });
        }
    }
};


export default { create, open, draw };