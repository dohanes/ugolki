import bcrypt from 'bcryptjs';

import { validateSignIn, validateSignUp } from 'ugolki-lib';

import passport from 'passport';

import { Strategy as LocalStrategy } from 'passport-local';

import db from 'db';

const { User } = db.models;

passport.serializeUser((user, done) => {
    done(null, user.id);
})


passport.deserializeUser((id, done) => {
    User.findOne({
        where: {
            id: id
        }
    }).then(user => {
        done(null, user || null)
    })
})

passport.use('local-signup', new LocalStrategy({}, async (username, password, done) => {
    const validation = validateSignUp(username, password);
    if (!validation.ok) {
        return done(null, false, {message: validation.reason})
    }
    
    const existingUser = await User.findOne({
        where: {
            username: username
        }
    })

    if (existingUser) {
        return done(null, false, {message: "This username already exists! Please choose another one."})
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);


    const createdUser = await User.create({
        username: username,
        password: hash
    })

    return done(null, createdUser.id);
})
)

passport.use('local-signin', new LocalStrategy({}, async (username, password, done) => {
    const validation = validateSignIn(username, password);
    if (!validation.ok) {
        return done(null, false, {message: validation.reason})
    }

    const user = await User.findOne({
        where: {
            username: username
        }
    })

    if (user == null) {
        return done(null, false, {message: "Invalid username or password."})
    }

    if (bcrypt.compareSync(password, user.password)) {
        return done(null, user)
    } else {
        return done(null, false, {message: "Invalid username or password."})
    }
    
}));

export default passport;