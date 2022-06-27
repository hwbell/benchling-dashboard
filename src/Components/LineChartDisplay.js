import React from 'react'
import '../App.css';
import { BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]
class LineChartDisplay extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dataKey: null,
      formattedData: null
    }

    this.formatData.bind(this);
  }

  componentDidMount() {
    console.log('Scatter Plot Display mounted');
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      if (this.props.data.data) {
        this.formatData();
      }
    }
  }

  // this basically parses the existing data structure into one that the chart can understand
  formatData() {
    // console.log(this.props.data)
    console.log('formatting data')

    // this will hold all the objects in the end, in the recharts format, with averaged data for each month
    let allFormattedData = [];

    // we'll create a recharts data object for each month bucket with the averages
    this.props.data.data.forEach((obj) => {
      let formattedRun = {
        name: obj.name
      };

      // console.log(formattedRun)
      // console.log(obj)

      // make an array of each metric - CD, CPF, etc
      let metrics = ['Cluster Density', 'Clusters Passing Filter', 'Estimated Yield', 'Q30'];

      // create averages, one metric at a time - push into array and then calculate mean after. this way it won't miss any data and can only fail to use numbers at the very end when parsInt() is used
      metrics.forEach((metric) => {
        let metricArr = [];
        obj.runs.forEach((run) => {
          // console.log(run)
          // check if it is there first
          if (!!run[metric]) {
            // console.log(`computing data for ${metric}:`)
            metricArr.push(run[metric]);

          } else {
            // console.log(`missing some data for ${metric}`)
          }
        });

        // convert to actual numbers from the strings
        let numericMetricArr = metricArr.map((string) => {
          // this works already for everything but q30 ... so extract the q30 info from between the last space and the % sign
          if (metric === 'Q30' && string.lastIndexOf(' ') !== -1) {
            return parseInt(string.slice(string.lastIndexOf(' '), string.indexOf('%')));
          } else {
            return parseInt(string);
          }

        });
        // console.log(numericMetricArr)
        // dump anything that isn't a number and average
        let cleaned = numericMetricArr.filter(num => !isNaN(num));
        let average = cleaned.reduce((a, b) => a + b, 0) / cleaned.length;
        // console.log(`average: ${average}`)

        // now add the average to the recharts object
        formattedRun[metric] = parseInt(average);

      });

      // add the recharts object with all the metric avgs to the allFormattedData array
      allFormattedData.push(formattedRun)

    });
    console.log(allFormattedData)

    this.setState({
      formattedData: allFormattedData
    });
  }

  render() {


    return (
      <div className="scatter-plot-display">
        {this.props.data ?
          <div>{this.props.data.data[0].name} - {this.props.data.data[this.props.data.data.length - 1].name}</div>
          : null}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={'80%'}
            height={'50%'}
            data={this.state.formattedData || data}
            margin={{
              top: 20
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Estimated Yield" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Cluster Density" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Q30" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>

        {/* <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={'80%'}
            height={'50%'}
            data={this.state.formattedData || data}
            margin={{
              top: 20
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Cluster Density" stackId="a" fill="#8884d8" />

            {/* <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
            <Bar dataKey="amt" stackId="a" fill="#82ca9d" /> 
          </BarChart>
        </ResponsiveContainer> */}
      </div>
    );
  }
}

export default LineChartDisplay;
