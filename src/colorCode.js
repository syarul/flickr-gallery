import React, { Component } from 'react'

// simple custom photo search by color
// NOTE: the api search by color is not documented (or can't find it)
const colors = [
  {code:'0', background:'#ff2000', title:'Red'},
  {code:'b', background:'#ff9f9c', title:'Pink'},
  {code:'6', background:'#00ab00', title:'Lime Green'},
  {code:'8', background:'#0062c6', title:'Blue'}
]

export default class ColorCode extends Component {
  createColor(clr, i) {
    return <span className='clr' key={i} onClick={this.props.setColor.bind(null, clr.code)} style={{background: clr.background}} title={clr.title}></span>
  }
  createColorCode(colors) {
    return colors.map(this.createColor.bind(this))
  }
  render(){
    return (
      <div id='colorCode'>
        {this.createColorCode(colors)}
      </div>
    )
  }
}