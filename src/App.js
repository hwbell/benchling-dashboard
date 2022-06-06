import React from 'react'
import logo from './logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// import { entriesData } from './tools/sampleData';
import { Spinner } from 'reactstrap';

// const apiUrl = `https://neb.benchling.com/api/v2/entries/etr_9ZPhUKMU`;


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      records: null,
      stats: null,
    }

    // this.readFiles = this.readFiles.bind(this);
  }
  componentDidMount() {
    console.log('mounted!')

    // let htmlFileLocation = "DNA Seq Core Records/Nextseq Run Logs/Run 321_210805_NB_Deyra 2021-08-06 (etr_Ib40XD2q)"
    // console.log(`./${htmlFileLocation}.html`)
    // let encodedHtmlFileLocation = encodeURI(htmlFileLocation);
    // console.log(htmlFileLocation)
    // console.log(encodedHtmlFileLocation)

    // // eslint-disable-next-line import/no-webpack-loader-syntax
    // var htmlModule = require(`raw-loader!./${htmlFileLocation}.html`);
    // var html = htmlModule.default;
    // console.log(html);

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
    // console.log(allFiles)
    // set to state and then map info
    this.setState({
      records: allFiles
    }, () => {
      this.mapFileInfo(allFiles)
    });

  }

  // this funcion will read the desired info from all the html strings and create and basic object with the info
  // ex {CD: ..., CPF: ..., EY: ..., Q30: ...} for each run
  mapFileInfo(htmlStrings) {
    // console.log(htmlStrings[0].default)
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

    console.log(totalRunsInfo[4])

  }

  renderSpinners() {
    return (
      // show when data is there
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
              : null}
          </div>


        </div>
      </div>
    );
  }
}

export default App;
