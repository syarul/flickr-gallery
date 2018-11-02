import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import ColorCode from './colorCode'

const safeSearch = [
  {value: '', label:'SafeSearch on' },
  {value: '2', label:'SafeSearch moderate' },
  {value: '3', label:'SafeSearch off' }
]

export default class FilterType extends Component {
  constructor(){
    super()

    this.state = {
      licenseList:[{value: '', label:'Any license'}],
      defaultValue:{value: '', label:'Any license'},
      safeSearchDefault: safeSearch[0]
    }
  }
  setColor(clr){
    this.props.setColor(clr)
  }
  componentDidMount() {
    this.getLicenceInfo()
  }
  async getLicenceInfo() {

    let method = 'flickr.photos.licenses.getInfo'
    let apiKey = '8818199aa15dacac5bfccabf86adf26f'

    let uri = `https://api.flickr.com/services/rest/?method=${method}&api_key=${apiKey}&format=json&nojsoncallback=1`

    const res = await fetch(uri)
    const json = await res.json()

    json.licenses.license.map(l => {
      let c = {
        value: l.id,
        label: l.name
      }
      this.setState({licenseList:[...this.state.licenseList, c]})
    })
  }
  changeLicense(value) {
    this.setState({defaultValue: value}, () => this.props.setLicense.call(this, value)) 
  }
  changeSafeSearch(value){
    this.setState({safeSearchDefault: value}, () => this.props.setSafeSearch.call(this, value))
  }
  render(){
    return (
      <div id='filterType'>
        <Dropdown 
          className='license' 
          options={this.state.licenseList} 
          onChange={this._onSelect, value => this.changeLicense.call(this, value)} 
          value={this.state.defaultValue} />
        <Dropdown className='safeSearch' 
          options={safeSearch} onChange={this._onSelect, value => this.changeSafeSearch.call(this, value)} 
          value={this.state.safeSearchDefault} />
        <ColorCode setColor={this.setColor.bind(this)} />
      </div>
    )
  }
}