import React from 'react'
import Axios from 'axios'

class Authentification extends React.Component {
    _isMounted = false;

    state = {
        username: '',
        password: '',
        errorPassClass: 'helper-text hide',
        errorPassMess: '',
        errorLogClass: 'helper-text hide',
        errorLogMess: ''
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleUsernameChange = e => {
        let username = e.target.value;    
        this.setState({ username: username });
    };

    handlePasswordChange = e => {
        let password = e.target.value;       
        this.setState({ password: password });    
    };

    handleLog = e => {
        const { username, password } = this.state;

        if (username === '') {
            this.setState({
                errorLogClass: 'helper-text red-text',
                errorLogMess: 'Username field must be filled!'
            })
        } else {
            this.setState({
                errorLogClass: 'helper-text hide'
            })

            if (password === '') {   
                this.setState({
                    errorPassClass: 'helper-text red-text',
                    errorPassMess: 'Password field is empty!'
                })
            } else {
                this.setState({
                    errorPassClass: 'helper-text hide'
                })

                Axios.post('http://localhost:5000/users/login', { username: username, password: password })
                        .then(response => { 
                            this.props.setUser(response.data);
                            this.props.history.push('/'); 
                        })
                        .catch(error => {
                            if (error.response.data.msg === 'Incorrect username' || error.response.data.msg === 'Incorrect password')
                                if (this._isMounted)    
                                    this.setState({ 
                                        errorLogClass: 'helper-text red-text',
                                        errorLogMess: error.response.data.msg
                        })});
            }
        }  
    }

    render() {
        const { username, password, 
            errorLogClass, errorLogMess, 
            errorPassClass, errorPassMess } = this.state;
        
        const notification = this.props.match.params.notification === '1' ? (
            <div className="notification right">
                <span className="red-text">To access this feature you need to LogIn!</span>
            </div>
        ) : (
            <div className="notification">

            </div>
        )

        return(
            <div className="container">
                <div className="note card">
                    <div className="card-content">
                        <form>
                            <div className="input-field">
                                <i className="material-icons prefix">account_circle</i>
                                <input id="username" type="text" className="validate" value={ username } onChange={ this.handleUsernameChange }/>
                                <label htmlFor="username" className="active">Username</label>
                                <span className={ errorLogClass } data-error="wrong">{ errorLogMess }</span>
                            </div>

                            <div className="input-field">
                                <i className="material-icons prefix">create</i>
                                <input id="pass" type="password" className="validate" value={ password } onChange={ this.handlePasswordChange }/>
                                <label htmlFor="pass" className="active">Password</label>
                                <span className={ errorPassClass } data-error="wrong">{ errorPassMess }</span>
                            </div>
                        </form>
                    </div>

                    <div className="card-action">
                        <button className="btn red darken-3" onClick={ this.handleLog }>
                            <i className="material-icons left">how_to_reg</i>
                            LogIn
                        </button>
                    </div>
                </div>
                { notification }
            </div>
        )
    }
}

export default Authentification