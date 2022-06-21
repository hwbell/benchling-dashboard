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
class BarChartDisplay extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('Scatter Plot Display mounted')
    console.log(this.props.data)
  }

  render() {
    return (
      <div className="scatter-plot-display">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={'80%'}
            height={'50%'}
            data={data}
            margin={{
              top: 20
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" stackId="a" fill="#8884d8" />
            {/* <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
            <Bar dataKey="amt" stackId="a" fill="#82ca9d" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default BarChartDisplay;
