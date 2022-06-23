import React from 'react'
import '../App.css';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


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
      if (this.props.data) {
        this.formatData();
      }
    }
  }

  formatData() {
    console.log('formatting data')

    let formattedData = this.props.data.map((obj) => {
      // make an array of each metric - CD, CPF, etc
      let metrics = ['Cluster Density', 'Clusters Passing Filter', 'Estimated Yield', 'Q30'];
      metrics.forEach((metric) => {
        // check if it is there first
        if (!!obj.runs[metric]) {
          let metricData = obj.runs.map((run) => {
            return run[metric]
          });
          var total = 0;
          for (var i = 0; i < metricData.length; i++) {
            total += metricData[i];
          }
          var avg = total / metricData.length;
          // append to the formattedData
          formattedData[metric] = avg;
        }

      })

    });

    console.log(formattedData)
    this.setState({ formattedData });
    return formattedData;

  }

  render() {


    return (
      <div className="scatter-plot-display">
        {this.props.data ?
          <div>{this.props.data[0].name} - {this.props.data[this.props.data.length - 1].name}</div>
          : null}

        <ResponsiveContainer width="100%" height="100%">
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
            <Bar dataKey={this.state.dataKey} stackId="a" fill="#8884d8" />
            {/* <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
            <Bar dataKey="amt" stackId="a" fill="#82ca9d" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default LineChartDisplay;
