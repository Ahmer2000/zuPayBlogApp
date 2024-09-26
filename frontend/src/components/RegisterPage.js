import React, { useState } from 'react'

function RegisterPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    async function register(e) {
        e.preventDefault();

        const response = await fetch('https://zupayblogappbackend.onrender.com/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        })
        if (response.status === 200) {
            alert('Registration Successful!')
        }
        else{
            alert('Registration Failed. Username should be unique and should consist minimum of 4 letters.')
        }
    }
    return (
        <>
            <h1 style={{ textAlign: 'center', color: '#363636', fontFamily: 'nunito', marginBottom: '2.5rem', fontSize: '2.7rem' }}>Register</h1>
            <form onSubmit={register}>
                <input type='text' className='registerInput' placeholder='username' value={username} onChange={e => { setUsername(e.target.value) }}></input>
                <input type='password' className='registerInput' placeholder='password' value={password} onChange={e => { setPassword(e.target.value) }}></input>
                <button>Register</button>
            </form>
        </>
    );
}

export default RegisterPage;
