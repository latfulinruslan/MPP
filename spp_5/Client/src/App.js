import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Navbar from './components/NavBar';
import Notes from './components/Notes';
import NoteEdit from './components/NoteEdit';
import NoteDetails from './components/NoteDetails'
import Authentification from './components/Authentification';
import Registration from './components/Registration';
import ApolloClient from "apollo-boost";

class App extends React.Component {
  state = {
    username: null,
    client: null
  }

  setUser = (data) => {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userId', data.id);
    
    let client = new ApolloClient({
      uri: "http://localhost:5000/graphql"
    });
     
    this.setState({ 
      username: data.username,
      client: client
    });
  }

  deleteUser = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');

    this.setState({
      username: null,
      client: null
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar username={ this.state.username } deleteUser={ this.deleteUser } />
          <Route exact path='/' render={(props) => <Notes {...props} client={ this.state.client } deleteUser={ this.deleteUser } />}/>
          <Route path='/authentification/:notification' render={(props) => <Authentification {...props} setUser={ this.setUser } />}/>
          <Route path='/registration' component={ Registration }/>
          
          <Route path='/add/:note_id' render={(props) => <NoteEdit {...props} client={ this.state.client } />}/>
          <Route path='/edit/:note_id' render={(props) => <NoteEdit {...props} client={ this.state.client } />}/>

          <Route path='/details/:note_id' render={(props) => <NoteDetails {...props} client={ this.state.client } />}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;


// GET - retrieve data from the server
// POST - send data to the server 
// PUT - update data
// DELETE - delete data