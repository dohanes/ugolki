import pkg from 'bcryptjs';
const { genSalt, hash: _hash, compare } = pkg;

import passport from 'passport';

import { Strategy as LocalStrategy } from 'passport-local';

db.query("SELECT 1;").then(rows => {
    console.log(rows)
})

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = $1', [id], (err, user) => {
        if (err || user.rows.length < 1) {
            done(null, null)
        } else {
            done(null, user.rows[0])
        }
    })
})

passport.use('local-signup', new LocalStrategy({}, (username, password, done) => {
    if (typeof password != 'string' || password.length < 8) {
        return done(null, false, 'Your password must be at least 8 characters long!');
    }
    api.getPlayer(username, { forceUpdate: true, overrideHiding: true }).then(player => {
        if (typeof player !== 'object') {
            return done(null, false, 'A Minecraft account with the username you provided does not exist.');
        } else {
            if (player.verified && player.verified != undefined) {
                return done(null, false, 'An account with this username already exists! Please try logging in instead.');
            }
            genSalt(10, function (err, salt) {
                _hash(password, salt, function (err, hash) {
                    if (player.uid != undefined) {
                        db.query("UPDATE public.user SET password=$1, verified=FALSE WHERE id = $2 RETURNING uuid", [hash, player.uid], (err, doc) => {
                            console.log(err)
                            return done(null, doc.rows[0].uuid);
                        })
                    } else {
                        db.query("INSERT INTO public.user(uuid, password, verified, options, referral_code) VALUES (uuid_generate_v4(), $1, $2, $3, $4) RETURNING id,uuid", [hash, false, "{}", getRandomString(8)], function (err, doc) {
                            if (err) console.log(err)
                            db.query("UPDATE player SET \"user\"=$1 WHERE uuid=$2", [doc.rows[0].id, player.uuid]).then(() => {
                                console.log(err)
                                return done(null, doc.rows[0].uuid);
                            })
                        })
                    }

                });
            });
        }
    })
})
)

passport.use('local-signin', new LocalStrategy({}, (username, password, done) => {
    var db = api.getDB();
    db.query("SELECT id, uuid as \"uid\", password, verified FROM public.user WHERE id = (SELECT \"user\" FROM player WHERE LOWER(uuid) = $1 OR LOWER(username) = $1)", [username.toLowerCase()], (err, doc) => {
        if (doc == null || doc.rows.length < 1) {
            return done(null, false, 'Invalid username or password.');
        } else {
            doc = doc.rows[0];
            if (!doc.verified) {
                return done(null, false, 'Your account was not verified! Please use the sign up process again.')
            } else {
                compare(password, doc.password).then(function (result) {
                    if (result) {
                        db.query("DELETE FROM deletion WHERE user = $1", [doc.id], () => {
                            return done(null, doc);
                        })
                    } else {
                        return done(null, false, 'Invalid username or password.');
                    }
                });
            }
        }
    });
}));

export default passport;