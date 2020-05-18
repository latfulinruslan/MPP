import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Navbar from './components/NavBar';
import Notes from './components/Notes';
import NoteEdit from './components/NoteEdit';
import NoteDetails from './components/NoteDetails'
import Authentification from './components/Authentification';
import Registration from './components/Registration';
import io from 'socket.io-client';

class App extends React.Component {
  state = {
    username: null,
    socket: null
  }

  setUser = (data) => {
    localStorage.setItem('authToken', data.token);

    let socket = io('http://localhost:5000', {
        query: {
          token: localStorage.getItem('authToken')
        }
    });

    socket.on('error', (err) => {
      localStorage.removeItem('authToken');
      console.error(err);
      this.props.history.push('/');
    });
     
    this.setState({ 
      username: data.username,
      socket: socket
    }); 
  }

  deleteUser = () => {
    localStorage.removeItem('authToken');
    this.state.socket.close();
    this.setState({
      username: null,
      socket: null
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar username={ this.state.username } deleteUser= { this.deleteUser } />
          <Route exact path='/' render={(props) => <Notes {...props} socket={ this.state.socket } />}/>
          <Route path='/authentification/:notification' render={(props) => <Authentification {...props} setUser={ this.setUser } />}/>
          <Route path='/registration' component={ Registration }/>
          <Route path='/add/:note_id' render={(props) => <NoteEdit {...props} socket={ this.state.socket } />}/>
          <Route path='/edit/:note_id' render={(props) => <NoteEdit {...props} socket={ this.state.socket } />}/>
          <Route path='/details/:note_id' render={(props) => <NoteDetails {...props} socket={ this.state.socket } />}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
