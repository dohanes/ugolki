function validatePassword(password) {
    if (!password || password.length < 8) {
        return { ok: false, reason: "Your password must be at least 8 characters long!" }
    } else if (password.length > 48) {
        return { ok: false, reason: "Your password cannot be longer than 48 characters!" }
    } else {
        return { ok: true }
    }
}

export function validateEmail(email) {
    return !email || email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function validateSignUp(username, email, password) {
    if (!username || username.length < 3) {
        return { ok: false, reason: "Usernames must be at least 3 characters long!" }
    } else if (!/^[a-z0-9]+$/i.test(username)) {
        return { ok: false, reason: "Usernames must be alphanumeric!" }
    } else if (username.length > 16) {
        return { ok: false, reason: "Usernames cannot be longer than 16 characters!" }
    } else if (email && !validateEmail(email)) {
        return { ok: false, reason: "Invalid email!" }
    } else {
        const validation = validatePassword(password)
        if (!validation.ok) {
            return validation;
        } else {
            return { ok: true }
        }
    }
}

export function validateSignIn(identifier, password) {
    if (!validateEmail(identifier)) {
        if (!validateSignUp(identifier, password).ok) {
            return { ok: false, reason: "Invalid username/email and password combination. Please try again!"}
        } else {
            return { ok: true }
        }
    } else {
        const validation = validatePassword(password)
        if (!validation.ok) {
            return validation;
        } else {
            return { ok: true }
        }
    }
}