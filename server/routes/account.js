import { Router } from 'express';
const router = Router();

import { Op } from 'sequelize';
import db from '../../db/index.js';
const { Game, User } = db.models;

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
                    return res.status(400).json({ error: err });
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
                    return res.status(400).json({ error: err });
                } else {
                    return res.status(200).json({success: true});
                }
            })
        }
    })(req, res, next)
})

router.post('/log-out', (req, res, next) => {
    req.logOut();
    return res.sendStatus(200);
})

router.post('/get-data', (req, res, next) => {
    return res.status(200).json({ loggedIn: req.user != undefined, username: req.user?.username })
})

async function getGames(uid, offset) {
    const games = await Game.findAll({
        where: {
            [Op.or]: [{ white: uid }, { black: uid }],
            winner: { [Op.not]: null }
        },
        include: [
            {
                model: User,
                as: 'whitePlayer',
                foreignKey: 'white'
            },
            {
                model: User,
                as: 'blackPlayer',
                foreignKey: 'black'
            }
        ],
        offset: offset || 0,
        limit: 20
    })

    return games.map(x => ({
        players: [x.whitePlayer.username, x.blackPlayer.username],
        result: x.winner === '0' ? 'Playing' : x.winner === '1' ? x.whitePlayer.username + ' Won' : x.blackPlayer.username + ' Won',
        opponent: x.white == uid ? x.blackPlayer.username : x.whitePlayer.username,
        started: x.started,
        uuid: x.uuid
    }))
}

router.post('/get-profile', async (req, res, next) => {
    let username;

    if (req.body.username) {
        username = req.body.username
    } else if (req.user) {
        username = req.user.username
    } else {
        res.status(200).json({success: false})
    }

    const profile = await User.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            username: username
        }
    })

    if (!profile) {
        return res.status(200).json({success: false})
    } else {
        return res.status(200).json({
            success: true,
            ...profile.dataValues,
            games: await getGames(profile.id)
        })
    }
})

export default router;