import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App';
import {Link} from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext)
    useEffect(() => {
        fetch('/posts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setData(result.posts)
        })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if (item._id == result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
        .then(res => res.json())
        .then(result=> {
            const newData = data.map(item => {
                if (item._id == result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId
            })
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if (item._id == result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData);
        })
        .catch(error => {
            console.log(error)
        })
    }

    const deletePost = (postId) => {
        fetch(`/delete/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
             const newData = data.filter(item => {
                 return item._id !== result._id
             })
             setData(newData);
        })
    }

    return(
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding: "5px"}}>
                                <Link to={item.postedBy._id == state._id ? "/profile" : "/profile/" + item.postedBy._id}>{item.postedBy.name}</Link>
                                {item.postedBy._id == state._id
                                && <i className="material-icons" 
                                style={{float: "right"}}
                                onClick={() => deletePost(item._id)}
                                >delete</i>
                                }
                            </h5>
                            <div className="card-image">
                                <img 
                                src={item.photo}
                                />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id)
                                ? <i className="material-icons" style={{color: "red"}}
                                onClick={() => {unlikePost(item._id)}}>favorite</i> : 
                                <i className="material-icons" style={{color: "red"}}
                                onClick={() => {likePost(item._id)}}>favorite_border</i>
                                }

                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight: "500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(event => {
                                    event.preventDefault()
                                    makeComment(event.target[0].value, item._id)
                                })}>
                                    <input type="text" placeholder="add a comment"></input>
                                </form>
                            </div>
                        </div>
                    )
                })
            }
            
        </div>
    )
}

export default Home