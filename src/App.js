import React from 'react'
import logo from './logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button } from 'reactstrap';

import BarChartDisplay from './Components/BarChartDisplay.js';


const instruments = ['All Instruments', 'MiSeq', 'NextSeq', 'NovaSeq']

// NOTES //
// make a bar chart with # of runs per instrument
// make scatter plot of CD, per instrument/all - https://recharts.org/en-US/examples/ThreeDimScatterChart
// make scatter plot of EY, per instrument/all - https://recharts.org/en-US/examples/ThreeDimScatterChart
// make scatter plot of CPF, per instrument/all - https://recharts.org/en-US/examples/ThreeDimScatterChart'
// make a plot of CD vs CPF 


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      records: null,
      data: null,
      dataToPlot: null,
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
    let novaseqData = this.mapFileInfo(novaseqFiles, 'Novaseq')

    // set to state with keys matching instruments 
    this.setState({
      records: allFiles,
      data: {
        'All Instruments': allData,
        'MiSeq': miseqData,
        'NextSeq': nextseqData,
        'NovaSeq': novaseqData
      }
    }, () => {
      // console.log('data separated by instrument')
    });

  }

  // this function will read the desired info from the html strings and create an object with the info
  // ex {CD: ..., CPF: ..., EY: ..., Q30: ...} for each run
  mapFileInfo(htmlStrings, instrument) {

    let totalRunsInfo = [];
    let statsNeeded = ['Submittor Name', 'Date', 'Run Type', 'Cluster Density', 'Clusters Passing Filter', 'Estimated Yield', 'Q30', 'Sample @'];

    // Nova seq's have a 'Library Concentration' entry instead of 'Sample @'
    if (instrument === 'Novaseq') {
      statsNeeded[statsNeeded.indexOf('Sample @')] = 'Library Concentration'
    }

    for (let i = 0; i < htmlStrings.length; i++) {
      let file = htmlStrings[i].default;
      let infoObj = {};

      // *try to find a fix for the date, it has too much info*
      statsNeeded.forEach((stat, i) => {
        let ind = file.indexOf(stat);
        let info = file.slice(ind, ind + 50);

        if (stat === 'Sample @') {
          info = info.slice(0, info.indexOf('nM') + 2).trim();
        } else {
          info = info.slice(info.indexOf(':') + 1, info.indexOf('<')).trim();
        }

        if (info.indexOf('\n') > -1) {
          info = info.slice(0, info.indexOf('\n'));
        }

        infoObj[stat] = info;
      });
      totalRunsInfo.push(infoObj);

    }
    // console.log(totalRunsInfo[0])
    return totalRunsInfo;

  }

  // this will extract one metric from the data set, ex Cluster Density, and create an array for recharts
  pullFieldData(field, data) {
    // {
    //   name: 'Page A',
    //   uv: 4000,
    //   pv: 2400,
    //   amt: 2400,
    // }

    console.log(field)
    console.log(data.length)


  }

  showData(instrument) {
    console.log(`showing data for ${instrument}`)

    let data = this.state.data[instrument];
    console.log(data)
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

          <div className="data-buttons">
            {instruments.map((instrument) => {
              return <Button key={instrument} color="primary btn-lg" onClick={() => this.showData(instrument)}>{instrument}</Button>
            })}
          </div>

          {this.state.data ?
            <BarChartDisplay data={this.state.dataToPlot} />
            : null}
        </div>
      </div>
    );
  }
}

export default App;
