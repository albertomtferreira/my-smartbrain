import { Component } from 'react';
import Navigation from './Navigation/Navigation';
import Logo from './Logo/Logo';
import ImageLinkForm from './ImageLinkForm/ImageLinkForm';
import Rank from './Rank/Rank';
import ParticlesEffect from './Particles/Particles';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';


// //CLARIFAI
// // Your PAT (Personal Access Token) can be found in the portal under Authentification
// const PAT = '5d64e4b1500c49f68d6173563b6facb9';
// // Specify the correct user_id/app_id pairings
// // Since you're making inferences outside your app's scope
// const USER_ID = 'clarifai';       
// const APP_ID = 'main';
// // Change these to whatever model and image URL you want to use
// const MODEL_ID = 'face-detection';
// const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
// const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
// ///////////////////////////////////////////////////////////////////////////////////
// // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
// ///////////////////////////////////////////////////////////////////////////////////
// const raw = JSON.stringify({
//     "user_app_id": {
//         "user_id": USER_ID,
//         "app_id": APP_ID
//     },
//     "inputs": [
//         {
//             "data": {
//                 "image": {
//                     "url": IMAGE_URL
//                 }
//             }
//         }
//     ]
// });
// const requestOptions = {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Authorization': 'Key ' + PAT
//     },
//     body: raw
// };
// // END OF CLARIFAI

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:{},
    }
  }

  calculcateFaceLocation = (data) => {
    // console.log("calculcateFaceLocation: ",data);
    // console.log("Short: ",data.outputs[0].data.regions[0].region_info.bounding_box);
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
    console.log(box);
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
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';     
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
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => this.displayFaceBox(this.calculcateFaceLocation(result))) 
    .catch(error => console.log('error', error));
    
  }
  //console.log(result.outputs[0].data.regions[0].region_info.bounding_box))
  render(){
  return (
    <div className='App'>
      <Navigation/>
      <ParticlesEffect/>
      <Logo/>
      <Rank/>
      <ImageLinkForm 
        onInputChange={this.onInputChange}
        onButtonSubmit={this.onButtonSubmit}
      />
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>    
    </div>
  );
  }
}

export default App;