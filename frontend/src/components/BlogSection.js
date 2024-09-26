import React from 'react'
import {format} from "date-fns";
import { Link } from 'react-router-dom';

function BlogSection({_id,title,summary,blogImg,createdAt,author}) {
    return (
        
            <div className='blogPost'>
                <div className='blogImg'>
                    <Link to={`/post/${_id}`}><img src={'https://zupayblogappbackend.onrender.com' + blogImg} alt='blogImage'/></Link>
                </div>
                <div className='blogContent'>
                    <Link to={`/post/${_id}`}><h2>{title}</h2></Link>
                    <span className='author'>{author.username}</span>
                    <time>{format(new Date(createdAt),'d-MMM-yyyy HH:mm:ss')}</time>
                    <p>{summary}</p>
                </div>
            </div>   
        
    );
}

export default BlogSection;
