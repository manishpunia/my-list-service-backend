import { Router } from 'express';
import { addToList, removeFromList, listMyItems } from '../controllers/userListController';

const router = Router();

router.post('/add', addToList);
router.delete('/remove/:contentId', removeFromList);
router.get('/', listMyItems);

export default router;