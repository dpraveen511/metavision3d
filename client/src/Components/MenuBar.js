import React, { useState, useEffect,useRef ,createContext, useContext   } from 'react';
import { BrowserRouter as Router, Routes, Route, Link,useNavigate } from 'react-router-dom';
import './MenuBar.css'
import Tutorials from './Tutorials';
import ListNormalFiles from './ListNormalFiles';
import ListAlzemiersFiles from './ListAlzemiersFiles';
import ListPompeFiles from './ListpPompeFiles';
import { useActiveLink } from './ActiveLinkContext';
function MenuBar(){
    const navigate = useNavigate();
    const {activeLink, setActiveLink} = useActiveLink();//useActiveLink();//useState('Normal');

    const handleNavLinkClick = (linkName) => {
        setActiveLink(linkName);
        navigate('/' + linkName.toLowerCase());
    };
    const navItems = ['Normal', 'Alzheimers', 'Another', 'Tutorials'];
    const NormalPage = () => <ListNormalFiles></ListNormalFiles>;
    const ADPage = () => <ListAlzemiersFiles></ListAlzemiersFiles>;
    const AnotherPage = () => <div><h2>Another Page</h2></div>;
    const TutorialsPage = () => <Tutorials></Tutorials>
    return (
    <div>
        <div class = "sticky-navbar">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark nav-style">
  
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav ">
                <Link className={`nav-item nav-link ${activeLink === 'Normal' ? 'active' : ''}`} to="/normal" onClick={() => handleNavLinkClick('Normal')}>Normal</Link>
                <Link className={`nav-item nav-link ${activeLink === 'Alzheimers' ? 'active' : ''}`} to="/alzheimers" onClick={() => handleNavLinkClick('Alzheimers')}>Alzheimers</Link>
                <Link className={`nav-item nav-link ${activeLink === 'Pompe' ? 'active' : ''}`} to="/pompe" onClick={() => handleNavLinkClick('Pompe')}>Pompe</Link>
                <Link className={`nav-item nav-link ${activeLink === 'Tutorials' ? 'active' : ''}`} to="/tutorials" onClick={() => handleNavLinkClick('Tutorials')}>Tutorials</Link>
      
                </div>
            </div>
        </nav>
        </div>
        <Routes>
                <Route path="/normal" element={<ListNormalFiles />} />
                <Route path="/alzheimers" element={<ListAlzemiersFiles />} />
                <Route path="/pompe" element={<ListPompeFiles />} />
                <Route path="/tutorials" element={<Tutorials />} />
        </Routes>
        </div>
    );
}
export default MenuBar;