import React from 'react'
import Axios from 'axios';

class Registration extends React.Component {
    _isMounted = false;
    state = {
        username: '',
        password: '',
        rePassword: '',
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

    handleRePasswordChange = e => {
        let rePassword = e.target.value;       
        this.setState({ rePassword: rePassword });
    };

    handleReg = e => {
        const { username, password, rePassword } = this.state;

        if (username === '') {
            this.setState({
                errorLogClass: 'helper-text red-text',
                errorLogMess: 'Username field must be filled!'
            })
        } else {
            this.setState({
                errorLogClass: 'helper-text hide'
            })

            if (password === rePassword) {
                if (password === '') {   
                    this.setState({
                        errorPassClass: 'helper-text red-text',
                        errorPassMess: 'Passwords to small!'
                    })
                } else {
                    this.setState({
                        errorPassClass: 'helper-text hide'
                    })

                    Axios.post('http://localhost:5000/users/register', { username: username, password: password })
                        .then(response => { this.props.history.push('/authentification/0') })
                        .catch(error =>  {
                            if (error.response.data.msg === 'User with this username already exists') {
                                if (this._isMounted)
                                this.setState({ 
                                    errorLogClass: 'helper-text red-text',
                                    errorLogMess: error.response.data.msg
                            })}});
                }
            } else {
                this.setState({
                    errorPassClass: 'helper-text red-text',
                    errorPassMess: 'Passwords dont match!'
                })
            }
        }
    }

    render() {
        const { username, password, rePassword, 
            errorPassClass, errorLogClass, errorPassMess, errorLogMess } = this.state;

        return(
            <div className="container">
                <div className="note card">
                    <div className="card-content">
                        <form>
                            <div className="input-field">
                                <i className="material-icons prefix">account_circle</i>
                                <input id="username" type="text" value={ username } onChange={ this.handleUsernameChange }/>
                                <label htmlFor="username" className="active">Username</label>
                                <span className={ errorLogClass } data-error="wrong">{ errorLogMess }</span>
                            </div>

                            <div className="input-field">
                                <i className="material-icons prefix">create</i>
                                <input id="pass" type="password" className="validate" value={ password } onChange={ this.handlePasswordChange }/>
                                <label htmlFor="pass" className="active">Password</label>
                                <span className={ errorPassClass } data-error="wrong">{ errorPassMess }</span>
                            </div>

                            <div className="input-field">
                                <i className="material-icons prefix">create</i>
                                <input id="rePass" type="password" className="validate" value={ rePassword } onChange={ this.handleRePasswordChange }/>
                                <label htmlFor="rePass" className="active">Repeat Password</label>
                                <span className={ errorPassClass } data-error="wrong">{ errorPassMess }</span>
                            </div>

                           
                        </form>
                    </div>

                    <div className="card-action">
                        <button className="btn red darken-3" onClick={ this.handleReg }>
                            <i className="material-icons left">person_add</i>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Registration