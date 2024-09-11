import {useContext, useEffect} from "react";
import {Link} from "react-router-dom";
import {UserContext} from './UserContext'

function Header() {
    const{setUserInfo,userInfo} = useContext(UserContext)
    useEffect(()=>{
        fetch('https://zupayblogappbackend.onrender.com/profile',{
            credentials:'include',
        }).then(response=>{response.json().then(userInfo=>{setUserInfo(userInfo)})})
    },[]);
    async function logout(){
        await fetch('https://zupayblogappbackend.onrender.com/logout',{
            method:'POST',
            credentials:'include',
        })
        setUserInfo(null);
    }

    const username = userInfo?.username;
    return (
            <header>
                <Link  to={username?'/':'/login'} className='logo' onClick={e=>{if(!username){alert("Please login to access the app's features.")}}}>ZuBlog</Link>
            <nav>
                {username && (
                    <>
                        <button><i className="fa-solid fa-user" style={{"color": "#ffffff",fontSize:'small'}}></i>{username}</button>
                        <Link to={'/createPost'} className="createP" >New Post</Link>
                        <Link to={'/login'} onClick={logout}>Logout</Link>
                    </>
                )}
                {!username && (
                    <>
                        <Link to='/login'>Login</Link>
                        <Link to='/register'>Register</Link>
                    </>
                )}
                
            </nav>
        </header>
    );
}

export default Header;
