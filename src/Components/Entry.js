import logo from './logo.svg';
import React from 'react'
import './App.css';
// import { getEntries } from './tools/serverFunctions';
// const apiUrl = `https://neb.benchling.com/api/v2/entries`;


class Entry extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('Entry mounted')
  }

  render() {
    return (
      <div className="entry">
        
      </div>
    );
  }
}

export default Entry;
