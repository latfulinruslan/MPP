import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App';

const Profile = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [image, setImage] = useState("");
    const {state, dispatch} = useContext(UserContext);
    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setMyPosts(result.myposts)
        })
    }, [])

    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image);
            data.append("upload_preset","inst-clone");
            data.append("cloud_name","instcloneimages");
            fetch("https://api.cloudinary.com/v1_1/instcloneimages/image/upload", {
                method: "POST",
                body: data
            })
            .then(res => res.json())
            .then(data => {
                fetch('/updateprofileimage', {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body:  JSON.stringify({
                        image: data.url
                    })
                })
                .then(res => res.json())
                .then(result => {
                    console.log(result);
                    localStorage.setItem("user", JSON.stringify({...state, image: result.image}));
                    dispatch({type: "UPDATEIMAGE", payload: result.image});
                })
            })
            .catch(error => {
                console.log(error)
            })
        }
    }, [image])

    const updatePhoto = (file) => {
        setImage(file)
    }

    return(
        <div style={{maxWidth: "750px", margin:"0px auto"}}>
            <div style={{
                    margin: "18px 0px",
                    borderBottom: "1px solid grey"
                }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                }}>
                    <div>
                        <img style={{width: "160px", height: "160px", borderRadius: "80px"}} 
                        src={state ? state.image : ""}
                        />
                    </div>
                    <div>
                        <h4>{state ? state.name: 'Loading...'}</h4>
                        <h5>{state ? state.email: 'Loading...'}</h5>
                        <div style={{display: "flex", justifyContent:"space-between", width: "108%"}}>
                            <h6>{myPosts.length} posts</h6>
                            <h6>{state ? state.followers.length : 0} followers</h6>
                            <h6>{state ? state.following.length : 0} following</h6>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field" style={{margin: "10px"}}>
                    <div className="btn #64b5f6 blue lighten-2">
                        <span>Upload image</span>
                        <input 
                        type="file"
                        onChange={(event) => updatePhoto(event.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    myPosts.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile