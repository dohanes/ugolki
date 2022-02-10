import { useState } from 'react';
import { validateSignIn, validateSignUp } from 'ugolki-lib'

function Modals() {
    const [signInUsername, setSignInUsername] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signUpUsername, setSignUpUsername] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');

    const [signInError, setSignInError] = useState('');
    const [signUpError, setSignUpError] = useState('');

    const signUp = () => {
        const verify = validateSignUp(signUpUsername, signUpPassword);

        if (verify.ok) {
            console.log('yep1')
            setSignUpError('')
            let status;
            fetch("/api/account/sign-up", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: signUpUsername, password: signUpPassword})
            })
            .then((res) => {
                status = res.status;
                return res.json()
            })
            .then((data) => {
                console.log(status)
                if (status === 400) {
                    setSignUpError(data.error)
                } else if (status === 200) {
                    window.location.reload(false);
                } else {
                    setSignUpError("An unknown error occurred. Please try again later.")
                }
            }).catch(e => {
                setSignUpError("An unknown error occurred. Please try again later.")
            })
        } else {
            setSignUpError(verify.reason)
        }
    }

    const signIn = () => {
        const verify = validateSignIn(signInUsername, signInPassword);

        if (verify.ok) {
            setSignInError('')

            let status;
            fetch("/api/account/sign-in", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: signInUsername, password: signInPassword })
            })
            .then((res) => {
                status = res.status;
                return res.json()
            })
            .then((data) => {
                if (status === 400) {
                    setSignInError(data.error)
                } else if (status === 200) {
                    window.location.reload(false);
                } else {
                    setSignInError("An unknown error occurred. Please try again later.")
                }
            }).catch(e => {
                setSignInError("An unknown error occurred. Please try again later.")
            })

        } else {
            setSignInError(verify.reason)
        }
    }

    return (
        <>
        <div className="modal fade" id="signInModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Sign In</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <input type="email" className="form-control" id="sign-in-id" placeholder="Username or Email" value={signInUsername} onInput={e => setSignInUsername(e.target.value)} />
                        </div>
                        <div className="mb-3">
                                <input type="password" className="form-control" id="sign-in-password" placeholder="Password" value={signInPassword} onInput={e => setSignInPassword(e.target.value)} />
                        </div>
                        <div className="signin-error text-danger">{signInError}</div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={signIn}>Sign In</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="signUpModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Sign Up</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                                <input type="email" className="form-control" id="sign-up-username" placeholder="Username" value={signUpUsername} onInput={e => setSignUpUsername(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                                <input type="password" className="form-control" id="sign-up-password" placeholder="••••••••" value={signUpPassword} onInput={e => setSignUpPassword(e.target.value)} />
                        </div>
                        <div className="signup-error text-danger">{signUpError}</div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={signUp}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Modals;