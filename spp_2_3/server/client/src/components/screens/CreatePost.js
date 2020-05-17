import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        if (!url) { return }
        fetch("/createpost",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title,
                body,
                url
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({html: data.error, classes: "#e53935 red darken-1"})
            } else {
                M.toast({html: "Post created successfully", classes: "#43a047 green darken-1"})
                history.push('/')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }, [url])

    const PostDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset","inst-clone")
        data.append("cloud_name","instcloneimages")
        fetch("https://api.cloudinary.com/v1_1/instcloneimages/image/upload", {
            method: "POST",
            body: data
        })
        .then(res => res.json())
        .then(data => {
           setUrl(data.url) 
        })
        .catch(error => {
            console.log(error)
        })
        
    }

    return(
        <div className="card input-field" style={{
            margin:"30px auto",
            maxWidth: "750px",
            padding: "20px",
            textAlign: "center"
          }}>
            <input 
            type="text" 
            placeholder="title" 
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            />
            <input 
            type="text" 
            placeholder="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue lighten-2">
                    <span>Upload image</span>
                    <input 
                    type="file"
                    onChange={(event) => setImage(event.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button 
            className="btn waves-effect waves-light #64b5f6 blue lighten-2"
            onClick={() => PostDetails()}
            >Submit Post</button>
        </div>
    )
}

export default CreatePost