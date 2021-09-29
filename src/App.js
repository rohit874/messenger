import { useEffect, useState } from 'react';
import { BrowserRouter as Router , Route, Switch } from 'react-router-dom';
import './styles/home.css';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { userContext } from './userContext';
import axios from 'axios';

function App() {

  //Check set login/logout state
  const [islogIn, setIsLogin] = useState(false);
  const [ currentUser , setCurrentUser] = useState(null);

  // fetching the current user data
  
  useEffect(()=>{
    if (localStorage.hasOwnProperty("authToken")) {
      const loadUserData = async () => {
        var config = {
          headers:{
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${window.localStorage.getItem('authToken')}`
        }};
    
        try {
          const response = await axios.get('https://messenger-api-rohit.herokuapp.com/api/getuser',config)
          setCurrentUser(response.data.user);
        } catch (err) {
          Logout();
        }
      }
      loadUserData();
      setIsLogin(true);
    }
  },[]);

  const Logout = () => {
    localStorage.removeItem('authToken');
    setIsLogin(false);
}


  //switch b/w light & Dark theme
  let theme_dark = "--theme: black; --text: white; --background:#383838;";
  let theme_light = "--theme: white; --text: black; --background:#ececec;";
  const [themeDark, setThemeDark] = useState(false);
  const Changetheme = () => {
    if (!themeDark) {
      document.documentElement.style.cssText = theme_dark;
    }
    else{
      document.documentElement.style.cssText = theme_light;
    }
    setThemeDark(!themeDark);
  }

  

  return (
    <>
    <Router>
    <userContext.Provider value={{ currentUser }}>
    <nav>
      <div className="logo">
        <h1>Massenger</h1>
      </div>
      <div className="nav-right">
        {/* <h5>{currentUser.name}</h5> */}
        <span className="theme-icon">&#9728;</span>
        <label className="switch">
          <input onChange={Changetheme} type="checkbox" />
          <span className="slider round"></span>
      </label>
      { islogIn ? <button onClick={Logout}>Logout</button> : "" }
      </div>
    </nav>


    <Switch>
      <Route path="/login">
        <Login login={setIsLogin} />
      </Route>
      <Route path="/signup">
        <Signup login={setIsLogin} />
      </Route>
      <Route path="/">
      <Home /> 
      </Route>
    </Switch>

</userContext.Provider>
    </Router>


    </>
  );
}

export default App;
