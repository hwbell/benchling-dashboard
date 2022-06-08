import React from 'react'
import logo from './logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Spinner, Button } from 'reactstrap';

const instruments = ['All Instruments', 'MiSeq', 'NextSeq', 'NovaSeq']

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      records: null,
      stats: null,
    }

    this.showData = this.showData.bind(this);
  }
  componentDidMount() {
    console.log('mounted!')

    this.readFiles('./DNA Seq Core Records/');

  }

  readFiles(folder) {
    // DNA Seq Core Records
    function importAll(r) {
      return r.keys().map(r);
    }

    // seems like doing require in a loop via variables is problematic. Leave it hardcoded for now ...
    // eslint-disable-next-line import/no-webpack-loader-syntax
    let nextseqFiles = importAll(require.context(`raw-loader!./DNA Seq Core Records/Nextseq Run Logs/`, false, /\.html$/));
    // eslint-disable-next-line import/no-webpack-loader-syntax
    let miseqFiles = importAll(require.context(`raw-loader!./DNA Seq Core Records/Miseq Run Logs/`, false, /\.html$/));
    // eslint-disable-next-line import/no-webpack-loader-syntax
    let novaseqFiles = importAll(require.context(`raw-loader!./DNA Seq Core Records/Novaseq Run Logs/`, false, /\.html$/));

    let allFiles = nextseqFiles.concat(miseqFiles, novaseqFiles);

    // separate based on instrument
    let allData = this.mapFileInfo(allFiles)
    let miseqData = this.mapFileInfo(miseqFiles)
    let nextseqData = this.mapFileInfo(nextseqFiles)
    let novaseqData = this.mapFileInfo(novaseqFiles)

    // set to state 
    this.setState({
      records: allFiles,
      allData,
      miseqData,
      nextseqData,
      novaseqData
    }, () => {
      console.log('data separated by instrument')
    });

  }

  // this funcion will read the desired info from the html strings and create and basic object with the info
  // ex {CD: ..., CPF: ..., EY: ..., Q30: ...} for each run
  mapFileInfo(htmlStrings) {

    let totalRunsInfo = [];
    let statsNeeded = ['Date', 'Run Type', 'Cluster Density', 'Clusters Passing Filter', 'Estimated Yield', 'Q30', 'Sample @'];

    for (let i = 0; i < htmlStrings.length; i++) {
      let file = htmlStrings[i].default;
      let infoObj = {};

      // *try to find a fix for the date, it has too much info*
      statsNeeded.forEach((stat, i) => {
        let ind = file.indexOf(stat);
        let info = file.slice(ind, ind + 35);
        info = info.slice(info.indexOf(':') + 1, info.indexOf('<')).trim();
        infoObj[stat] = info;
      });
      totalRunsInfo.push(infoObj);
    }

    return totalRunsInfo;

  }

  // this will extract one metric from the data set, ex Cluster Density, and create an array for recharts
  pullFieldData(field, data) {

  }

  renderSpinners() {
    return (
      // hide when data is there
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
          return (
            <div>Hello!</div>
          )
        })}
      </div>
    )
  }

  showData(instrument) {
    console.log(`showing data for ${instrument}`)
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
          <p>Benchling Dashboard</p>
          <p>Explore Entries</p>
          <p>View Data Trends</p>
        </div>

        <div className="App-content">

          {!this.state.records ?
            <div className="loading-spinners">
              <p>just a moment ... </p>

              {this.renderSpinners()}

            </div>
            : null}

          <div className="data-buttons">
            {instruments.map((instrument) => {
              return <Button key={instrument} color="primary btn-lg" onClick={() => this.showData(instrument)}>{instrument}</Button>
            })}
          </div>

        </div>
      </div>
    );
  }
}

export default App;
