// import 'regenerator-runtime'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Pagination from 'react-js-pagination'

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import './base.styl'

window.log = console.log.bind(console)

const license = [
  { value: '', label: 'Any license' },
  { value: '2%2C3%2C4%2C5%2C6%2C9', label: 'All creative commons' }
]

const licenseDefault = license[0]

const safeSearch = [
  { value: '', label: 'SafeSearch on' },
  { value: '2', label: 'SafeSearch moderate' },
  { value: '3', label: 'SafeSearch off' }
]

const safeSearchDefault = safeSearch[0]

class Gallery extends Component {
  constructor () {
    super()
    this.state = {
      searchInput:'',
      images:[],
      activePage: 1,
      totalItemsCount: 0,
      colorCodes: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.clearSearchInput = this.clearSearchInput.bind(this)
    this.queryValue = this.queryValue.bind(this)
    this.keyPress = this.keyPress.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
  }
  handleChange(event) {
    this.setState({searchInput: event.target.value})
  }
  clearSearchInput() {
    this.setState({searchInput:''})
  }
  queryValue() {
    // ignore when searchInput is empty
    if (!this.state.searchInput.length) return

    // clean up images state before making new request
    this.setState({images:[]})
    this.requestImages(this.state.searchInput)
  }
  keyPress(evt){
    if (evt.which === 13) this.queryValue()
  }
  componentDidMount() {
    // load the page with a default text
    this.setState({searchInput: 'ocean'}, () => this.queryValue())
  }
  async requestImages(text) {

    let method = 'flickr.photos.search'
    let apiKey = '8818199aa15dacac5bfccabf86adf26f'

    let perPage = 12 // number of images per page

    let uri = `https://api.flickr.com/services/rest/?method=${method}&api_key=${apiKey}&text=${text}&per_page=${perPage}&format=json&nojsoncallback=1`

    uri = uri + `&page=${this.state.activePage}`

    uri = !this.state.colorCodes ? uri : uri + `&color_codes=${this.state.colorCodes}`

    const res = await fetch(uri)
    const json = await res.json()
    log(uri)
    // log(JSON.stringify(json, false, 2))

    this.setState({totalItemsCount: json.photos.total})

    json.photos.photo.map(gp => {
      let farmId = gp.farm
      let serverId = gp.server
      let id = gp.id
      let secret = gp.secret
      this.setState({images:[...this.state.images, `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}.jpg`]})
    })

  }
  createImage(image, i) {
    return <div className='imageContainer' key={i} style={{height:'300px'}}><img src={image} alt={'image'} /></div>
  }
  createImages(images) {
    return images.map(this.createImage)
  }
  handlePageChange(pageNum){
    this.setState({activePage: pageNum}, () => this.queryValue())
  }
  setColor(color){
    this.setState({colorCodes: color}, () => this.queryValue())
  }
  setLicense(code){
    log(code)
  }
  setSafeSearch(code){
    log(code)
  }
  render() {
    return (
      <div>
      	<div className='inputList'>
      		<input 
            className='search' 
            value={this.state.searchInput} 
            onChange={this.handleChange} 
            onKeyPress={this.keyPress} />
          <input type='button' value='X' onClick={this.clearSearchInput} />
          <input type='submit' onClick={this.queryValue} />
      	</div>
        <div id='filterType'>
          <Dropdown className='license' options={license} onChange={this._onSelect, value => this.setLicense.call(this, value)} value={licenseDefault} />
        	<Dropdown className='safeSearch' options={safeSearch} onChange={this._onSelect, value => this.setSafeSearch.call(this, value)} value={safeSearchDefault} />

          <span className='clr' onClick={this.setColor.bind(this, '0')} style={{background:'#ff2000'}} title='Red'></span>
          <span className='clr' onClick={this.setColor.bind(this, 'b')} style={{background:'#ff9f9c'}} title='Pink'></span>
          <span className='clr' onClick={this.setColor.bind(this, '6')} style={{background:'#00ab00'}} title='Lime Green'></span>
          <span className='clr' onClick={this.setColor.bind(this, '8')} style={{background:'#0062c6'}} title='Blue'></span>
        </div>
        <div id='imageGallery'>
          {this.createImages(this.state.images)}
        </div>
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={12}
          totalItemsCount={this.state.totalItemsCount}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }
}

ReactDOM.render(<Gallery />, document.getElementById('app'))