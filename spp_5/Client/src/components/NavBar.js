import React from 'react'
import { Link, withRouter } from 'react-router-dom'

class Navbar extends React.Component {

    handleLogOut = () => {
        this.props.deleteUser();
    }

    render(){
        const username = this.props.username;
        const component = username ? (
            <div>
                <li className="usersInfo">{ username }</li>
                <li>
                    <a href="/" onClick={ this.handleLogOut } className="valign-wrapper">
                    <i className="material-icons left">exit_to_app</i>LogOut
                </a></li>
            </div>
        ) : (
            <div>
                <li><Link to="/authentification/0" className="valign-wrapper">
                    <i className="material-icons left">how_to_reg</i>LogIn
                </Link></li>
                <li><Link to="/registration" className="valign-wrapper">
                    <i className="material-icons left">person_add</i>Register
                </Link></li>
            </div>
        )
        return (
            <nav className="nav-wrapper red darken-3">
                <div className="container">
                    <Link to="/" className="brand-logo">Notes</Link>
                    <ul className="right">
                        { component }
                    </ul>
                </div>
            </nav>
        )
    }
}

export default withRouter(Navbar)