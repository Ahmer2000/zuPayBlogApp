import { useEffect, useState } from "react";
import BlogSection from "./BlogSection";

function IndexPage() {
    const [posts, setPosts] = useState([])

    useEffect(()=>{
        fetch('http://localhost:3001/createNewPost').then(response=>{response.json().then(posts=>{setPosts(posts);})})
    },[]);
    return ( 
        <>
            {posts.length?posts.length > 0 && posts.map((post,index)=>{
                return <BlogSection {...post} key={index}/>
            }):(<div className="whenNoPostOnPage" >No blog posts.</div>)}
        </>
    );
}

export default IndexPage;
