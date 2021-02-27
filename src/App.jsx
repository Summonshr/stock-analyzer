import React from 'react'
import './App.css';
import Home from './Home';
import Note from './Note';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Company from './single'
import capture from './capture';

window.capture = capture

localStorage.clear();

window.onkeydown = function (e) {
  if (e.code === 'KeyC' && e.ctrlKey ) {
    capture()
  }
}


function App(){
  return <Router>
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/company/:company" exact>
        <Company/>
      </Route>
      <Route path="/note/card" exact>
        <Note/>
      </Route>
    </Switch>
</Router>
}

export default App;
