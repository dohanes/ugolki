import { Router } from 'express';
const router = Router();

import passport from '../passport/setup.js';

router.post('/sign-in', (req, res, next) => {
    passport.authenticate('local-signin', (err, user, info) => {
        if (err) {
            return res.status(400).json({ error: err })
        } else if (!user) {
            return res.status(400).json({ error: info.message })
        } else {
            req.logIn(user, err => {
                if (err) {
                    return res.status(400).json(err);
                } else {
                    return res.status(200).json({success: true});
                }
            })
        }
    })(req, res, next)
})

router.post('/sign-up', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) {
            return res.status(400).json({ error: err })
        } else if (!user) {
            return res.status(400).json({ error: info.message })
        } else {
            req.logIn(user, err => {
                if (err) {
                    return res.status(400).json(err);
                } else {
                    return res.status(200).json({success: true});
                }
            })
        }
    })(req, res, next)
})

export default router;