import React from 'react'
import logo from './logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button } from 'reactstrap';

import LineChartDisplay from './Components/LineChartDisplay.js';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const instruments = ['All', 'MiSeq', 'NextSeq', 'NovaSeq']

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

    this.showRuns = this.showRuns.bind(this);
  }
  componentDidMount() {
    console.log('App mounted')

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
        'All': allData,
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
    // console.log(field)
    // console.log(data.length)
  }

  // this will show the total runs for an instrument / all instruments
  showRuns(instrument) {
    console.log(`showing data for ${instrument}`)

    let data = this.state.data[instrument];

    // the Bar Chart accepts data in the form:
    // [{
    //   name: 'January 2021',
    //   runs: 45,
    //   yield: 2400, //in GB
    //   CPF: 91,
    //   Q30: 86,
    // }, ...]

    // first make buckets for the months ... we can average things to appear in the above form after
    // each bucket is one month
    let monthBuckets = [];
    data.forEach((obj, i) => {
      let date = new Date(obj.Date);
      let thisBucket = {
        month: date.getMonth(),
        year: date.getFullYear(),
        name: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
        runs: []
      }
      // check for some nonsense entries
      if (thisBucket.year < 2021) {
        thisBucket.year = 2021;
        thisBucket.name = `${monthNames[date.getMonth()]} 2021`;
      }
      // if it has real date info, use it
      if (thisBucket.name !== 'undefined NaN') {
        monthBuckets.push(thisBucket)
      }
    });

    // once every bucket has a name property, filter the unique ones
    let uniqueBuckets = monthBuckets.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.name === value.name
      ))
    );

    // sort by year, then by month 
    uniqueBuckets.sort((a,b) => {
      return a.month - b.month
    }).sort((a,b) => {
      return a.year - b.year
    })

    // add data to buckets
    uniqueBuckets.forEach((bucket, i) => {
      // console.log(`evaluating for ${bucket.name}`)
      // console.log(data)
      data.forEach((obj) => {
        let objDate = new Date(obj.Date);
        let belongsInThisBucket = (objDate.getMonth() === bucket.month && objDate.getFullYear() === bucket.year);
        if (belongsInThisBucket) {
          bucket.runs.push(obj);
        }
      })
      // console.log(bucket)
    })

    this.setState({
      dataToPlot: uniqueBuckets
    }, () => {
      console.log(this.state.dataToPlot)
    })

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
          {!this.state.dataToPlot ?
            <div style={{margin: 30}}>Click on an instrument to show data!</div>
            : null}

          <div className="data-buttons">
            {instruments.map((instrument) => {
              return <Button key={instrument} color="primary btn-lg" onClick={() => this.showRuns(instrument)}>{instrument}</Button>
            })}
          </div>

          <LineChartDisplay key={'line-chart'} data={this.state.dataToPlot} />

        </div>
      </div>
    );
  }
}

export default App;
