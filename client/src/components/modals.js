import { useState } from 'react';
import { Verifier } from '../../../verifier.js'

function Modals() {
    const [signInIdentifier, setSignInIdentifier] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signUpUsername, setSignUpUsername] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');

    const signUp = () => {
        if (signUpUsername.length < 3) {

        } else if (signUpUsername.test(/^[a-z0-9]+$/i)) {

        }
    }

    const signIn = () => {
        alert("Yea")
    }

    return (
        <>
        <div class="modal fade" id="signInModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Sign In</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <input type="email" class="form-control" id="sign-in-id" placeholder="Username or Email" value="" onInput={e => setSignInIdentifier(e.target.value)} />
                        </div>
                        <div class="mb-3">
                                <input type="password" class="form-control" id="sign-in-password" placeholder="Password" value="" onInput={e => setSignInPassword(e.target.value)} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={signIn}>Sign In</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="signUpModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Sign Up</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Username</label>
                                <input type="email" class="form-control" id="sign-up-username" placeholder="Username" value="" onInput={e => setSignUpUsername(e.target.value)} />
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Email (Optional)</label>
                                <input type="email" class="form-control" id="sign-up-email" placeholder="name@example.com" value="" onInput={e => setSignUpEmail(e.target.value)} />
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Password</label>
                                <input type="password" class="form-control" id="sign-up-password" placeholder="••••••••" value="" onInput={e => setSignUpPassword(e.target.value)} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={signUp}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Modals;