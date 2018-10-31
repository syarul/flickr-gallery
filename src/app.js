import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './base.styl'

class Gallery extends Component {
  render() {
    return (
      <div>
      	<div className="inputList">
      		<input className="search"/><input type="button" value="X" /><input type="submit" />
      	</div>
        <div id="filterType">
        	<span>type</span><span>color</span><span>size</span><span>tags</span>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Gallery />, document.getElementById('app'))