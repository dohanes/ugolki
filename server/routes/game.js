import { Router } from 'express';
import GameTools from '../../lib/game-tools.js';
import db from '../../db/index.js';
import { Op } from 'sequelize';
const router = Router();

const { Game } = db.models;

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
        }
    })

    if (game) {
        return res.status(200).json({ success: true, playingAs: !game.white ? 'WHITE' : 'BLACK', playingAgainst: game.white || game.black, type: game.type })
    } else {
        return res.status(200).json({ success: false })
    }
})

router.post('/join-game', async (req, res, next) => {
    if (!req.user) return res.status(200).json({ success: false, reason: "You must be signed in to join a game!" })

    const game = await Game.findOne({
        uuid: req.body.uuid
    })

    if (game && !game.started && (!game.white || !game.black)) {
        if (!game.white) {
            game.white = req.user.id;
        } else {
            game.black = req.user.id;
        }
        game.started = new Date();
        await game.save();
    }
})

export default router;