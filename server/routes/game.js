import { Router } from 'express';
import GameTools from '../../lib/game-tools.js';
import db from '../../db/index.js';
import { Op } from 'sequelize';
const router = Router();

const { Game, User } = db.models;

router.post('/create', async (req, res, next) => {
    if (!req.user) return res.status(200).json({ success: false, reason: "You must be signed in to start a game!" })

    await Game.destroy({
        where: {
            [Op.or]: [{ white: req.user.id, black: null }, { black: req.user.id, white: null }]
        }
    })


    const type = ['3x3', '3x4', '4x4'].includes(req.body.type) ? req.body.type : '3x4';
    const color = ['WHITE', 'BLACK'].includes(req.body.color) ? req.body.color : Math.random() >= 0.5 ? 'WHITE' : 'BLACK';

    const state = GameTools.generateState(...type.split('x'));

    const game = await Game.create({
        white: color === 'WHITE' ? req.user.id : null,
        black: color === 'BLACK' ? req.user.id : null,
        state: state,
        pun: type + '>'
    })

    return res.status(200).json({ success: true, uuid: game.uuid, playingAs: color })
})

router.post('/get-invite-details', async (req, res, next) => {
    const game = await Game.findOne({
        where: {
            uuid: req.body.uuid
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
        ]
    })

    if (game) {
        return res.status(200).json({ success: true, playingAs: !game.white ? 'WHITE' : 'BLACK', playingAgainst: game.whitePlayer?.username || game.blackPlayer?.username, type: game.type })
    } else {
        return res.status(200).json({ success: false })
    }
})

router.post('/join-game', async (req, res, next) => {
    if (!req.user) return res.status(200).json({ success: false, reason: "You must be signed in to join a game!" })

    const game = await Game.findOne({
        where: {
            uuid: req.body.uuid
        }
    })

    if (game && !game.started && (!game.white || !game.black)) {
        if (!game.white) {
            game.white = req.user.id;
        } else {
            game.black = req.user.id;
        }
        game.started = new Date();
        await game.save();
        return res.status(200).json({success: true, state: game.state})
    } else {
        return res.status(200).json({success: false, reason: "You cannot join this game anymore!"})
    }
})

router.post('/check-if-joined', async (req, res, next) => {
    if (!req.user) return res.status(200).json({joined: false})

    const game = await Game.findOne({
        where: {
            uuid: req.body.uuid,
            [Op.or]: [{ white: req.user.id, black: { [Op.not]: null } }, { black: req.user.id, white: { [Op.not]: null } }]
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
        ]
    })

    if (game) {
        return res.status(200).json({ joined: true, playingAgainst: game.white === req.user.id ? game.blackPlayer.username : game.whitePlayer.username, state: game.state })
    } else {
        return res.status(200).json({ joined: false })
    }
})

export default router;