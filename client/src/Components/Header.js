import React from 'react';
import logo from '../Images/SUNLab_Logo.webp';

function Header() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightgray', padding: '10px 0' }}>
            <a className='navbar-brand' href="#home" style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    alt="Sun Lab"
                    src={logo}
                     // Adjust to keep the image's aspect ratio
                    className="d-inline-block align-top"
                />
                <span style={{ fontSize: '42px', marginLeft: '10px' }}>Spatial Metabolomics Atlas of the 3D Brain</span>
            </a>
        </div>
    );
}

export default Header;
