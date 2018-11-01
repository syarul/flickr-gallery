import 'regenerator-runtime'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './base.styl'

window.log = console.log.bind(console)

class Gallery extends Component {
  constructor () {
    super()
    this.state = {
      searchInput: '',
      images: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.clearSearchInput = this.clearSearchInput.bind(this)
    this.queryValue = this.queryValue.bind(this)
    this.keyPress = this.keyPress.bind(this)
  }
  _handler() {}
  handleChange(event) {
    this.setState({searchInput: event.target.value})
    log(this.state)
  }
  clearSearchInput() {
    this.setState({searchInput: ''})
  }
  queryValue() {
    log(this.state)
  }
  keyPress(evt){
    if (evt.which === 13) this.queryValue()
  }
  async componentDidMount() {

    // let uri = 'https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=8818199aa15dacac5bfccabf86adf26f&gallery_id=66911286-72157647277042064&format=json&nojsoncallback=1'
    
    let method = 'flickr.photos.search'
    let apiKey = '8818199aa15dacac5bfccabf86adf26f'
    let perPage = 3
    let text  = 'cloud'

    let uri = `https://api.flickr.com/services/rest/?method=${method}&api_key=${apiKey}&text=${text}&per_page=${perPage}&format=json&nojsoncallback=1`

    const res = await fetch(uri)
    const json = await res.json()
    log(JSON.stringify(json, false, 2))

    json.photos.photo.map(gp => {
      let farmId = gp.farm
      let serverId = gp.server
      let id = gp.id
      let secret = gp.secret

      this.setState({images: [...this.state.images, `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}.jpg`]})

    })

  }
  createImage (image, i) {
    log(arguments)
    return <img src={image} alt={"image"} key={i} />
  }
  createImages (images) {
    // log(images, images)
    return images.map(this.createImage);
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
        	<span>type</span><span>color</span><span>size</span><span>tags</span>
        </div>
        <div id='images'>
          {this.createImages(this.state.images)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Gallery />, document.getElementById('app'))