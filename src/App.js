import React from 'react'
import logo from './logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { getEntries } from './tools/serverFunctions';
import { entriesData } from './tools/sampleData';
import { Spinner } from 'reactstrap';
const apiUrl = `https://neb.benchling.com/api/v2/entries`;


class App extends React.Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // getEntries(apiUrl)
    console.log(entriesData);

  }

  renderEntries() {
    console.log('rendering entries')
  }

  render() {
    return (
      <div className="App">

        <div className="header">
          <a
            className="App-link"
            href="https://benchling.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logo} className="App-logo" alt="logo" />
          </a>
          <p>Check Status</p>
          <p>View Data Trends</p>
          <p>Benchling Dashboard</p>
        </div>

        <div className="App-content">

          <p>just a moment ... </p>
          <div className="loading-spinners">
          <Spinner
            className="spinner"
            color="primary"
            type="grow"
          >
          </Spinner>
          <Spinner
            className="spinner"
            color="primary"
            type="grow"
            visible={true}
          >
          </Spinner>
          <Spinner
            className="spinner"
            color="primary"
            type="grow"
            visible={true}
          >
          </Spinner>
          </div>


        </div>
      </div>
    );
  }
}

export default App;
