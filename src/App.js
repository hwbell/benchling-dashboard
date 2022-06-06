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
    // eslint-disable-next-line import/no-webpack-loader-syntax
    const htmlFiles = importAll(require.context('raw-loader!./DNA Seq Core Records/Nextseq Run Logs/', false, /\.html$/));
    console.log(typeof(htmlFiles[0]))
    console.log(typeof(htmlFiles[0].default))

    let file = htmlFiles[0].default;

    // cluster density
    let cdInd = file.indexOf('Cluster Density')
    let cdInfo = file.slice(cdInd, cdInd+30)
    console.log(cdInfo)

    // clusters passing filter
    let cpfInd = file.indexOf('Clusters Passing Filter')
    let cpfInfo = file.slice(cpfInd, cpfInd+30)
    console.log(cpfInfo)

    // estimated yield
    let eyInd = file.indexOf('Estimated Yield')
    let eyInfo = file.slice(eyInd, eyInd+30)
    console.log(eyInfo)

    // q30
    let qInd = file.indexOf('Q30')
    let qInfo = file.slice(qInd, qInd+30)
    console.log(qInfo)

    this.setState({
      records: htmlFiles
    });

    
  }

  mapFileInfo() {

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
