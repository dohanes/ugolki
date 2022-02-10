import { Router } from 'express';
import GameTools from '../../lib/game-tools.js';
import db from '../../db/index.js';
import { Op } from 'sequelize';
const router = Router();

const { Game, User } = db.models;

router.post('/create', async (req, res, next) => {
    if (!req.user) return res.status(200).json({ success: false, reason: "You must be signed in to start a game!" })

    try {
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
    } catch(e) {
        console.log(e)
        return res.status(200).json({ success: false, reason: "An unknown error occurred." })
    }
})

router.post('/get-invite-details', async (req, res, next) => {
    try {
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
            if (game.started !== null) {
                return res.status(200).json({ 
                    success: true, 
                    playingAs: req.user ? (game.white === req.user.id ? 'WHITE' : game.black === req.user.id ? 'BLACK' : 'NONE') : null, 
                    playingAgainst: req.user ? (game.white === req.user.id ? game.blackPlayer?.username : game.black === req.user.id ? game.whitePlayer?.username : null) : null, 
                    type: game.type,
                    started: true, 
                    isPlayer: game.white === req.user?.id || game.black === req.user?.id, 
                    state: game.state,
                    pun: game.pun,
                    turn: game.turn,
                    winner: game.winner
                })
            } else {
                return res.status(200).json({ 
                    success: true, 
                    playingAs: !game.white ? 'WHITE' : 'BLACK', 
                    playingAgainst: game.whitePlayer?.username || game.blackPlayer?.username, 
                    type: game.type
                })
            }
            
        } else {
            return res.status(200).json({ success: false })
        }
    } catch (e) {
        console.log(e)
        return res.status(200).json({ success: false, reason: "An unknown error occurred." })
    }
})

router.post('/join-game', async (req, res, next) => {
    if (!req.user) return res.status(200).json({ success: false, reason: "You must be signed in to join a game!" })

    try {
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
    } catch (e) {
        console.log(e)
        return res.status(200).json({ success: false, reason: "An unknown error occurred." })
    }
})

router.post('/check-if-joined', async (req, res, next) => {
    if (!req.user) return res.status(200).json({joined: false})

    try {
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
    } catch (e) {
        console.log(e)
        return res.status(200).json({ joined: false, reason: "An unknown error occurred." })
    }
})

router.post('/move', async (req, res, next) => {
    if (!req.user) return res.status(200).json({ success: false, reason: "You are not logged in!" })

    try {
        const game = await Game.findOne({
            where: {
                uuid: req.body.uuid,
                [Op.or]: [{ white: req.user.id, black: { [Op.not]: null } }, { black: req.user.id, white: { [Op.not]: null } }],
                started: { [Op.not]: null },
                ended: null
            },
        })

        if (game) {
            const playerId = req.user.id === game.white ? '1' : req.user.id === game.black ? '2' : null;

            if (!playerId) return res.status(200).json({ success: false, reason: "An unknown error occurred." })

            const gameTools = new GameTools(game.state, game.turn, game.pun);
            
            const validator = gameTools.move(playerId, req.body.from, req.body.to)

            if (!validator.success) {
                return res.status(200).json({ success: false, reason: validator.reason })
            } else {
                const gameObj = {
                    state: validator.tiles,
                    turn: validator.turn,
                    pun: validator.pun,
                    winner: validator.win,
                    ended: validator.win === '0' ? null : new Date()
                }
                game.set(gameObj)
                game.save();

                return res.status(200).json({success: true, ...gameObj})
            }
        } else {
            return res.status(200).json({success: false, reason: "Could not find that game!"})
        }
    } catch (e) {
        console.log(e)
        return res.status(200).json({ success: false, reason: "An unknown error occurred." })
    }
})

router.post('/get-status', async (req, res, next) => {
    try {
        const game = await Game.findOne({
            where: {
                uuid: req.body.uuid
            }
        })

        if (game) {
            return res.status(200).json({ success: true, state: game.state, pun: game.pun, turn: game.turn, winner: game.winner })
        } else {
            return res.status(200).json({ success: false, reason: "Could not find that game!" })
        }
    } catch (e) {
        console.log(e)
        return res.status(200).json({ success: false, reason: "An unknown error occurred." })
    }
})

router.post('/get-active', async (req, res, next) => {
    if (!req.user) return res.status(200).json({ success: false, reason: "You are not logged in!" })

    try {
        const games = await Game.findAll({
            where: {
                [Op.or]: [{white: req.user.id}, {black: req.user.id}],
                ended: null,
                winner: '0'
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

        return res.status(200).json({ success: true, games: games.map(game => (
            {
                uuid: game.uuid,
                opponent: game.white === req.user.id ? game.blackPlayer.username : game.whitePlayer.username,
                type: game.type,
                started: game.started,
                yourTurn: (game.white === req.user.id ? '1' : '2') === game.turn
            }
        ))})
    } catch (e) {
        console.log(e)
        return res.status(200).json({ success: false, reason: "An unknown error occurred." })
    }
})

router.post('/resign', async(req, res, next) => {
    if (!req.user) return res.status(200).json({ success: false, reason: "You are not logged in!" })
    
    try {
        const game = await Game.findOne({
            where: {
                [Op.or]: [{ white: req.user.id }, { black: req.user.id }],
                winner: '0',
                ended: null,
                started: {[Op.not]: null}
            }
        })

        if (game) {
            game.set({
                winner: game.white === req.user.id ? '2' : '1',
                ended: new Date()
            })
            game.save();
            return res.status(200).json({success: true, winner: game.winner})
        } else {
            return res.status(200).json({ success: false, reason: "Could not find that game!" })
        }
    } catch (e) {
        console.log(e)
        return res.status(200).json({ success: false, reason: "An unknown error occurred." })
    }
})

export default router;