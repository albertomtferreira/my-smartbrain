import Navigation from './Navigation/Navigation';
import Logo from './Logo/Logo';
import ImageLinkForm from './ImageLinkForm/ImageLinkForm';
import Rank from './Rank/Rank';
import ParticlesEffect from './Particles/Particles';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Navigation/>
      <ParticlesEffect/>
      <Logo/>
      <Rank/>
      <ImageLinkForm/>
      {/* <FaceRecognition/>     */}
    </div>
  );
}

export default App;
