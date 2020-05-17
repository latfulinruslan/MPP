import React, {useEffect, createContext, useReducer, useContext} from 'react';
import './App.css';
import NavBar from './components/NavBar';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import Login from './components/screens/Login';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import SignUp from './components/screens/SignUp';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscridesUserPosts from './components/screens/SubscridesUserPosts';
import {reducer, initialState} from './reducers/userReducer';

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({type: "USER", payload: user});
    } else {
      history.push('/login');
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path='/login'>
        <Login />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/signup'>
        <SignUp />
      </Route>
      <Route path='/create'>
        <CreatePost />
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile />
      </Route>
      <Route path='/myfollowingpost'>
        <SubscridesUserPosts />
      </Route>
    </Switch>
  )
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
