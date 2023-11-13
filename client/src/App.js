import logo from './Images/SUNLab_Logo.webp';
import './App.css';
import Header from './Components/Header.js'
import ListFiles from './Components/ListFiles.js';

function App() {
  return (
    <div className="App">
      <Header/>
      <ListFiles></ListFiles>
    </div>
  );
}

export default App;
