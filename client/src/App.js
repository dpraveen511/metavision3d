import logo from './Images/SUNLab_Logo.webp';
import './App.css';
import Header from './Components/Header.js'
import MenuBar from './Components/MenuBar.js';
import ListNormalFiles from './Components/ListNormalFiles.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { ActiveLinkProvider } from './Components/ActiveLinkContext.js';

function App() {
  return (
    
    <Router>
      
        <div >
          <Header />
          <MenuBar />
        </div>
      
    </Router>
    
  );
}

export default App;
