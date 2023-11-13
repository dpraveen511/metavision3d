import logo from './Images/SUNLab_Logo.webp';
import './App.css';
import Header from './Components/Header.js'
import ListFiles from './Components/ListFiles.js';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router basename="/api">
    <div className="App">
      <Header/>
      <ListFiles></ListFiles>
    </div>
    </Router>
  );
}

export default App;
