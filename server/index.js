import 'dotenv/config'

//Terminate if offline mode enabled
if (process.env.OFFLINE === 'true') {
    console.log("Offline Ugolki enabled, terminating API server...")
    process.exit()
}

//Import libraries
import express from "express";
import randomString from 'randomstring';
import sequelize from 'db';
import session from 'express-session';
import passport from './passport/setup.js';
import pgSession from 'connect-session-sequelize';
import fs from 'fs';


const app = express();


const SequelizeStore = pgSession(session.Store);

app.use(session({
    store: new SequelizeStore({
        db: sequelize
    }),
    secret: (process.env.SESSION_SECRET == undefined || process.env.SESSION_SECRET.length < 12) ? randomString.generate() : process.env.SESSION_SECRET,
    resave: true,
    proxy: true,
    cookie: { sameSite: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.listen(5000, () => {
    console.log(`Server listening on port 5000`);
});

for (const fileName of fs.readdirSync('../server/routes')) {
    let route = (await import('./routes/' + fileName)).default;
    app.use('/api/' + fileName.replace('.js', ''), route)
}

app.use("*", (req, res, next) => {
    return res.sendStatus(404);
})