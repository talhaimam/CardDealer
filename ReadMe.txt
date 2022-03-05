Author: Syed Muhammad Talha Imam

Date: 5 March, 2022

Pre-requisites:
*Node v16 *Node Packet Manager

Instructions on how to install and run the app:

1. clone and checkout the repository into a local machine.
2. run the "npm install" command in the main solution directory - this will install all the required packages
3. run the "npm run dev" command to run the application then.
4. the app is set to listen at localhost:6061
5. use the following route to Create a Deck:
	localhost:6061/deck/create
	JSON request format:  { "type": "FULL", "shuffled": true }

6. use the following route to Open a Deck:
	localhost:6061/deck/open
	JSON request format:  { "deckId": "a959ce4d-1b34-463f-be78-1eccddb88117" }

7. use the following route to Create a Deck:
	localhost:6061/deck/draw
	JSON request format:  { "deckId":"10940e7d-e2d1-4d6b-973e-5a51d09f0123", "count": 2 }

8. run the "npm run test" command to run the implemented tests.