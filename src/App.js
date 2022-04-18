import React from 'react'
import logo from './logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { getEntries } from './tools/serverFunctions';
// import { entriesData } from './tools/sampleData';
import { Spinner } from 'reactstrap';
const apiUrl = `https://neb.benchling.com/api/v2/projects`;


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      records: null,
      stats: null,
    }
  }
  componentDidMount() {
    let records = getEntries(apiUrl);
    
    console.log(records);

    setTimeout(() => {
      this.setState({
        entries: records
      });
    }, 2000)

    
  }

  renderSpinners() {
    return (
      <div className="spinners-holder">
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
          >
          </Spinner>
          <Spinner
            className="spinner"
            color="primary"
            type="grow"
          >
          </Spinner>
      </div>
    )
  }

  renderEntries() {
    console.log('rendering entries');
  }

  renderStats() {
    console.log('rendering stats');

    return (
      <div>
        {this.state.entries.map((entry) => {
          console.log(entry)
          return(
            <div>Hello!</div>
          )
        })}
      </div>
    )
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
          {!this.state.entries ? 
            this.renderSpinners()
          : null }
          </div>


        </div>
      </div>
    );
  }
}

export default App;
