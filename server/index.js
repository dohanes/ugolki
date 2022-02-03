import 'dotenv/config'

//Terminate if offline mode enabled
if (process.env.OFFLINE === 'true') {
    console.log("Offline Ugolki enabled, terminating API server...")
    process.exit()
}

//Import libraries
import express from "express";
import randomString from 'randomstring';
import sequelize from './sequelize/index.js'
import session from 'express-session';
import passport from './passport/setup.js';
import pgSession from 'connect-session-sequelize';


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

sequelize.sync();

app.listen(5000, () => {
    console.log(`Server listening on port 5000`);
});

app.get('/api/sign-in', (req, res, next) => {
    
})