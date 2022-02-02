import 'dotenv/config'

if (process.env.OFFLINE === 'true') {
    console.log("Offline Ugolki enabled, terminating API server...")
    process.exit()
}

global.db = undefined;

import express from "express";
import randomString from 'randomstring';
import session from 'express-session';
import passport from './passport/setup.js';

import pkg from 'pg';
const { Pool } = pkg;

import pgSession from 'connect-pg-simple';

const PORT = 5000;

const app = express();

const pool = new Pool();

pool.connect().then(client => {
    db = client;
    console.log("Connected to database")
});

var sess = {
    store: new (pgSession(session))(),
    secret: (process.env.SESSION_SECRET == undefined || process.env.SESSION_SECRET.length < 12) ? randomString.generate() : process.env.SESSION_SECRET,
    resave: false,
    cookie: { sameSite: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: true
};

app.use(session(sess));
//app.use(passport.initialize());
//app.use(passport.session());

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.get('/api/sign-in', (req, res, next) => {
    
})