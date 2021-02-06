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

window.onkeydown = function (e) {
  if (e.keyCode === 82 && e.ctrlKey && e.shiftKey) {
    e.preventDefault()
    localStorage.clear();
    window.location.reload()
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
