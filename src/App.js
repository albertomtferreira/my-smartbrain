import { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesEffect from './components/Particles/Particles';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const initialState={
  input:'',
  imageUrl:'',
  box:{},
  route: 'signin',
  isSignedIn: false,
  signinImageShow: false, 
  user:{
    id:'',
    name:'',
    email:'',
    entries: 0,
    joined: ''}
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      id:'',
      input:'',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn: false, 
      signinImageShow: false,
      user:{
        id:'',
        name:'',
        email:'',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data)=>{
    this.setState({
      user:{
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined:data.joined
    }})
  }

  calculcateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
        leftCol:clarifaiFace.left_col * width,
        topRow:clarifaiFace.top_row * height,
        rightCol:width-(clarifaiFace.right_col*width),
        bottomRow:height-(clarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event)=>{
    this.setState({input: event.target.value}); 
  }
  
  onButtonSubmit = ()=>{
    this.setState({signinImageShow: true})
    this.setState({imageUrl: this.state.input});
    fetch('https://mysmartbrain-api.onrender.com/imageurl',{
          method: 'post',
          headers:{'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
    .then(response => response.json())
    .then(result => {
      if (result){
        fetch('https://mysmartbrain-api.onrender.com/image',{
          method: 'put',
          headers:{'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(result => result.json())
        .then(count =>{
          this.setState(Object.assign(this.state.user, {entries: count})) 
        })
        .catch(error => console.log('error image url: ', error));
      }
      this.displayFaceBox(this.calculcateFaceLocation(result))
      
    }) 
    .catch(error => {
      console.log('error: ', error);
      alert('Please ensure that your link contains a image destination like JPG/JPEG/PNG');
      //  this.setState({signinImageShow: true});
    });
    
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
      
  render(){
    const {isSignedIn, imageUrl, route, box,signinImageShow} = this.state;
  return [
    <div className='App'>
      <ParticlesEffect/>  
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      {route === 'home'        
          ?<div>
            <Logo/>
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} signinImageShow={signinImageShow}/>
          </div>
          :(
            route === 'signin'
            ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
      }
    </div>
  ];
  }
}

export default App;