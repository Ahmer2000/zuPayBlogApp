import React,{useContext, useState} from 'react'
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
    const {setUserInfo} = useContext(UserContext)
    
    async function login(e){
        e.preventDefault();
        const response = await fetch('https://zupayblogappbackend.onrender.com/login',{
            method:'POST',
            body:JSON.stringify({username,password}),
            headers: { 'Content-Type': 'application/json' },
            credentials:'include',
        })
        if (response.ok) {
            response.json().then(userInfo=>{
                setUserInfo(userInfo);
                setRedirect(true);
            })
        }
        else{
            alert('wrong credentials.')
        }
    }
  
    if(redirect){
        return <Navigate to={'/'}/>
    }

    return (
        <>
            <h1 style={{textAlign:'center',color:'#363636',fontFamily:'nunito',marginBottom:'2.5rem',fontSize:'2.7rem'}}>Login</h1>
            <form onSubmit={login}>
                <input type='text' className='loginInput' placeholder='username' value={username} onChange={e=>{setUsername(e.target.value)}}></input>
                <input type='password' className='loginInput' placeholder='password' value={password} onChange={e=>{setPassword(e.target.value)}}></input>
                <button>Login</button>
            </form>
        </>
    );
}

export default LoginPage;
