import {React,useEffect,useState} from 'react';
import { Navigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';

function EditPost() {
    const{id} = useParams();
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect, setRedirect] = useState(false)

    useEffect(()=>{
        fetch(`http://localhost:3001/post/${id}`).then(response=>{response.json().then(postInfo=>{
            setTitle(postInfo.title);
            setSummary(postInfo.summary);
            setContent(postInfo.content);
        })})
    },[]);

    async function updatePost(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.set('title',title);
        formData.set('summary',summary);
        formData.set('content',content);
        formData.set('id',id);
        if (files?.[0]) {
            formData.set('file',files?.[0]);
        }
        const response = await fetch('http://localhost:3001/createNewPost',{
            method:'PUT',
            body:formData,
            credentials:'include',
        })

        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={`/post/${id}`}/>
    }

    return (
        <>
            <form onSubmit={updatePost}>
                <input type='title'className='editPostInput'  placeholder='Title' value={title} onChange={e=>{setTitle(e.target.value)}}></input>
                <input type='summary' className='editPostInput' placeholder='Summary' value={summary} onChange={e=>{setSummary(e.target.value)}}></input>
                <input type='file' className='fileInput' onChange={e=>{setFiles(e.target.files)}}/>
                <ReactQuill className='blogContent' value={content} onChange={newValue=>{setContent(newValue)}}/>
                <button className='updatePostBtn'>Update post</button>
            </form>
        </>
    )
}

export default EditPost;
