import { Component } from 'react';
import Navigation from './Navigation/Navigation';
import Logo from './Logo/Logo';
import ImageLinkForm from './ImageLinkForm/ImageLinkForm';
import Rank from './Rank/Rank';
import ParticlesEffect from './Particles/Particles';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';
class App extends Component {
  constructor() {
    super();
    this.state = {
      id:'',
      input:'',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn: false
    }
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
    this.setState({imageUrl: this.state.input});
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '5d64e4b1500c49f68d6173563b6facb9';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'clarifai';       
    const APP_ID = 'main';
    // Change these to whatever model and image URL you want to use
    //Models - https://clarifai.com/explore/models
    //age-demographics-recognition -- https://clarifai.com/clarifai/main/models/age-demographics-recognition
    //general-image-recognition -- https://clarifai.com/clarifai/main/models/general-image-recognition
    //color-recognition -- https://clarifai.com/clarifai/main/models/color-recognition
    //general-image-detection -- https://clarifai.com/clarifai/main/models/general-image-detection
    //face-detection -- https://clarifai.com/clarifai/main/models/face-detection
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = this.state.input;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    // END OF CLARIFAI
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => this.displayFaceBox(this.calculcateFaceLocation(result))) 
    .catch(error => console.log('error', error));
    
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
    
  render(){
    const {isSignedIn, imageUrl, route, box} = this.state;
  return [
    <div className='App'>
      <ParticlesEffect/>  
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      {route === 'home'        
          ?<div>
            <Logo/>
            <Rank/>
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
          :(
            route === 'signin'
            ?<Signin onRouteChange={this.onRouteChange}/>
            :<Register onRouteChange={this.onRouteChange}/>
          )
      }
    </div>
  ];
  }
}

export default App;