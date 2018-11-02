import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Pagination from 'react-js-pagination'
import FilterType from './filterType'
import './style/base.styl'

class Gallery extends Component {
  constructor () {
    super()
    this.state = {
      searchInput:'',
      images:[],
      activePage: 1,
      totalItemsCount: 0,
      colorCodes: '',
      licence: '',
      safeSearch:''
    }
  }
  handleChange(event) {
    this.setState({searchInput: event.target.value})
    if(event.target.value.length){
      this.setState({activePage:1})
    }
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

    uri = !this.state.licence ? uri : uri + `&licence=${this.state.licence}`

    uri = !this.state.safeSearch ? uri : uri + `&safe_search=${this.state.safeSearch}`

    const res = await fetch(uri)
    const json = await res.json()

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
    this.setState({licence: code.value}, () => this.queryValue())
  }
  setSafeSearch(code){
    this.setState({safeSearch: code.value}, () => this.queryValue())
  }
  render() {
    return (
      <div>
      	<div className='inputList'>
      		<input 
            className='search' 
            value={this.state.searchInput} 
            onChange={this.handleChange.bind(this)} 
            onKeyPress={this.keyPress.bind(this)} />
          <input type='button' value='X' onClick={this.clearSearchInput.bind(this)} />
          <input type='submit' onClick={this.queryValue.bind(this)} />
      	</div>
        <FilterType 
          setLicense={this.setLicense.bind(this)} 
          setSafeSearch={this.setSafeSearch.bind(this)} 
          setColor={this.setColor.bind(this)} />
        <div id='imageGallery'>
          {this.createImages(this.state.images)}
        </div>
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={12}
          totalItemsCount={this.state.totalItemsCount}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange.bind(this)}
        />
      </div>
    );
  }
}

ReactDOM.render(<Gallery />, document.getElementById('app'))