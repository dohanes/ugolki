import 'dotenv/config'

//Terminate if offline mode enabled
if (process.env.OFFLINE === 'true') {
    console.log("Offline Ugolki enabled, terminating API server...")
    process.exit()
}

//Import libraries
import express from "express";
import randomString from 'randomstring';
import sequelize from '../db/index.js';
import session from 'express-session';
import passport from '../server/passport/setup.js';
import pgSession from 'connect-session-sequelize';
import fs from 'fs';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit'


const app = express();


const SequelizeStore = pgSession(session.Store);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); 

app.use(session({
    store: new SequelizeStore({
        db: sequelize
    }),
    secret: (process.env.SESSION_SECRET == undefined || process.env.SESSION_SECRET.length < 12) ? randomString.generate() : process.env.SESSION_SECRET,
    resave: true,
    proxy: process.env.NODE_ENV === 'production',
    cookie: { sameSite: true, maxAge: 30 * 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production' },
    saveUninitialized: true
}));

app.set('trust proxy', 1);
app.use(passport.initialize());
app.use(passport.session());
app.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))

app.listen(3001, () => {
    console.log(`Server listening on port 3001`);
});

for (const fileName of fs.readdirSync('./server/routes')) {
    let route = (await import('./routes/' + fileName)).default;
    app.use('/api/' + fileName.replace('.js', ''), route)
}

app.use("*", (req, res, next) => {
    return res.sendStatus(404);
})