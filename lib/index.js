export function verifySignUp(username, password) {
    if (username.length < 3) {
        return { ok: false, reason: "Usernames must be at least 3 characters long!" }
    } else if (username.test(/^[a-z0-9]+$/i)) {
        return { ok: false, reason: "Usernames must be alphanumeric!" }
    } else if (username.length > 16) {
        return { ok: false, reason: "Usernames cannot be longer than 16 characters!" }
    } else if (password.length < 8) {
        return { ok: false, reason: "Your password must be at least 8 characters long!" }
    } else if (password.length > 48) {
        return { ok: false, reason: "Your password cannot be longer than 48 characters!" }
    } else {
        return { ok: true }
    }
}