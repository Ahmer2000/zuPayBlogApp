import { React, useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {format} from "date-fns";
import { UserContext } from "./UserContext";

function PostPage() {
    const {id} = useParams();
    const {userInfo} = useContext(UserContext)
    const [postInfo, setPostInfo] = useState(null);
    useEffect(() => {
        fetch(`http://localhost:3001/post/${id}`).then(response=>{response.json().then(postInfo=>{setPostInfo(postInfo)})})
    },[]);

    async function deletePost() {
        await fetch(`http://localhost:3001/deletePost/${id}`,{
            method:'DELETE',
            credentials:'include',
        })
    }

    if (!postInfo) return '';
    return ( 
        <>
            <div className="postDiv">
            {/* <div className="backToHomePage"><Link to={'/'}><i className="fa-solid fa-arrow-left" style={{color: "#363636",marginRight:'0.5rem'}}></i>Back</Link></div> */}
                <h2>{postInfo.title}</h2>
                <div className="blogDetailsEditBtn">
                    <div>
                        <span><time>{format(new Date(postInfo.createdAt),'d-MMM-yyyy | HH:mm:ss')}</time></span>
                        <span style={{marginLeft:'0.9rem'}}><p style={{display:'inline-block'}}>by @{postInfo.author.username}</p></span>
                    </div>
                </div>
                <div className="postImg">
                    <img src={`http://localhost:3001/${postInfo.blogImg}`} alt="blogPostImage"></img>
                </div>
                <p className="postContent" dangerouslySetInnerHTML={{__html:postInfo.content}}></p>
                <div className="postHandling">
                {userInfo.id === postInfo.author._id && (
                        <button  className="deleteBtn" onClick={deletePost} ><Link to={`/`}>Delete post</Link></button>
                )}
                {userInfo.id === postInfo.author._id && (
                        <button  className="editBtn"><Link to={`/edit/${postInfo._id}`}>Edit post</Link></button>
                    )}
                </div>
            </div>
        </>
    );
}

export default PostPage;
