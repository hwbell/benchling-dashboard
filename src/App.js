import logo from './logo.svg';
import React from 'react'
import './App.css';
import { getEntries } from './tools/serverFunctions';
const apiUrl = `https://neb.benchling.com/api/v2/entries`;


class App extends React.Component {

  constructor(props) {
  super(props);
  }
  componentDidMount() {
     getEntries(apiUrl)

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
