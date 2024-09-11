import {React, useState} from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';


function CreatePost() {
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect, setRedirect] = useState(false)

    async function createNewPost(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.set('title',title);
        formData.set('summary',summary);
        formData.set('content',content);
        formData.set('file',files[0]);

        console.log(files);
        const response = await fetch('https://zupayblogappbackend.onrender.com/createNewPost',{
            method:'POST',
            body:formData,
            credentials:'include',
        })
        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/'}/>
    }

    return (
    
            <form onSubmit={createNewPost}>
                <input className='createPostInput' type='title' placeholder='Title' value={title} onChange={e=>{setTitle(e.target.value)}}></input>
                <input className='createPostInput' type='summary' placeholder='Summary' value={summary} onChange={e=>{setSummary(e.target.value)}}></input>
                <input type='file' className='fileInput' onChange={e=>{setFiles(e.target.files)}}/>
                <ReactQuill className='blogContent' value={content} onChange={newValue=>{setContent(newValue)}}/>
                <button className='createPostBtn' disabled={!title||!files||!content }>Create post</button>
            </form>
        
    )
}
export default CreatePost;
