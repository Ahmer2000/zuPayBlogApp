import { useEffect, useState } from "react";
import BlogSection from "./BlogSection";

function IndexPage() {
    const [posts, setPosts] = useState([])

    useEffect(()=>{
        fetch('https://zupayblogappbackend.onrender.com/createNewPost').then(response=>{response.json().then(posts=>{setPosts(posts);})})
    },[]);
    return ( 
        <>
            {posts.length?posts.length > 0 && posts.map(post=>{
                return <BlogSection {...post}/>
            }):(<div className="whenNoPostOnPage" >No blog posts.</div>)}
        </>
    );
}

export default IndexPage;
