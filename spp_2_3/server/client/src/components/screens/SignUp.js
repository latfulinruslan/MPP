import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

const SignUp = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("")
    const [imageUrl, setImageUrl] = useState(undefined)

    useEffect(() => {
        if (imageUrl) {
            uploadFields();
        }
    }, [imageUrl])

    const uploadImage = () => {
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
            setImageUrl(data.url);
        })
        .catch(error => {
            console.log(error)
        })
    }

    const uploadFields = () => {
        if (!validate(email)) {
            M.toast({html: 'Invalid email', classes: "#e53935 red darken-1"});
            return
        }
        fetch("/signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                image: imageUrl
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({html: data.error, classes: "#e53935 red darken-1"});
            } else {
                M.toast({html: data.message, classes: "#43a047 green darken-1"});
                history.push('/login');
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    const validate = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase());
    }

    const PostData = () => {
        if (image) {
            uploadImage()
        } else {
            uploadFields()
        }
        
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
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
                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                    onClick={() => PostData()}
                >SignUp</button>
                <h5>
                    <Link to="/login">Already have an account?</Link>
                </h5>

            </div>
        </div>

    
    )
}

export default SignUp