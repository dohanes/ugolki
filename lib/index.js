function validatePassword(password) {
    if (!password || password.length < 8) {
        return { ok: false, reason: "Your password must be at least 8 characters long!" }
    } else if (password.length > 48) {
        return { ok: false, reason: "Your password cannot be longer than 48 characters!" }
    } else {
        return { ok: true }
    }
}

export function validateSignUp(username, password) {
    if (!username || username.length < 3) {
        return { ok: false, reason: "Usernames must be at least 3 characters long!" }
    } else if (!/^[a-z0-9]+$/i.test(username)) {
        return { ok: false, reason: "Usernames must be alphanumeric!" }
    } else if (username.length > 16) {
        return { ok: false, reason: "Usernames cannot be longer than 16 characters!" }
    } else {
        const validation = validatePassword(password)
        if (!validation.ok) {
            return validation;
        } else {
            return { ok: true }
        }
    }
}

export function validateSignIn(username, password) {
    if (!validateSignUp(username, password).ok) {
        return { ok: false, reason: "Invalid username and password combination. Please try again!"}
    } else {
        return { ok: true }
    }
}