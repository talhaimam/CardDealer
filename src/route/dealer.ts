import express from 'express';
import controller from '../controller/dealer';
const router = express.Router();

//All our routes are defined here, can add new end points whenever required for other games
router.get('/deck/create', controller.create);
router.get('/deck/open', controller.open);
router.get('/deck/draw', controller.draw);

export default router;