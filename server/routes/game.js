import { Router } from 'express';
import { GameTools } from 'ugolki-lib';
const router = Router();

router.post('/create', (req, res, next) => {
    const {color, type} = req.body;

    
})

export default router;