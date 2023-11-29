import React, { useState, useEffect,useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DisplayFile from './DisplayFile.js';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Input, Label, FormGroup} from 'reactstrap';
import '../App.css'
import logo from '../Images/SUNLab_Logo.webp';

function ListFiles() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('PI_38_5__impute_3d.nii.gz'); // State to track the selected file
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for toggling the dropdown
    const initialRender = useRef(true);
    const [firstRender,setFirstRender] = useState(true);
    const [enableProjection, setEnableProjection] = useState(false);
    const [removeBoundary, setRemoveBoundary] = useState(true);
    const [selectedIntensity, setSelectedIntensity] = useState(''); // This won't be editable
    const [minIntensity, setMinIntensity] = useState('');
    const [maxIntensity, setMaxIntensity] = useState('');
    const [maxIntensityPercentile, setMaxIntensityPercentile] = useState('95');
    const [smoothness, setSmoothness] = useState(0);
    const [runClicked, setRunClicked] = useState(false);
    const [projectClicked, setProjectClicked] = useState(false);
    const [sessionId,setSessionId] = useState(null);
    const [sessionName,setSessionName] = useState("meta_vision_session_id");

    const handleProjection = () => {
        setProjectClicked(true);
        console.log("Project clicked")
    };

    const handleMaxProjection = () => {
        setRunClicked(true);
        console.log("Run clicked")
    };

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    
    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    useEffect(() => {
        const sessionIdCookieName = sessionName;
        let currentSessionId = getCookie(sessionIdCookieName);

        if (!currentSessionId) {
            currentSessionId = uuidv4();
            setCookie(sessionIdCookieName, currentSessionId, 7); // Set for 7 days, adjust as needed
        }
        setSessionId(getCookie(sessionName));

        fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/listfiles`)
            .then(response => response.json())
            .then(data => {
                setFiles(data.files);
                console.log(data);
                // if (firstRender && data.files && data.files.length > 0) {
                //     setSelectedFile(data.files[0]);
                //     setFirstRender(false)
                // }

                // // Set the initialRender ref to false after the first render
                // initialRender.current = false;
            });

            console.log(process.env.NODE_ENV);
    }, [firstRender]);

    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

    const handleDownload = () => {
        if (!selectedFile) {
            console.error("No file selected for download.");
            return;
        }
    
        // Define the URL where the file is being served
        const fileURL = `${process.env.REACT_APP_FLASK_API_URL}/data/Original/${selectedFile}`;
    
        // Create a link and trigger the download
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = selectedFile; // Set the file name. Default is the URL's filename.
        document.body.appendChild(link); // Append to body to ensure visibility in older browsers
        link.click();
        document.body.removeChild(link); // Clean up
    };
    
    

    return (
        <div >
            {/* Example using Reactstrap Dropdown */}
            <div className='d-flex'>
            <div >
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} style={{ textAlign: 'left', width: '300px', padding: '10px' }}>
                <DropdownToggle caret  style={{ width: '400px' }}>
                    {selectedFile || "Select a file"}
                </DropdownToggle>
                {/* The right prop is omitted or set to false for left alignment */}
                <DropdownMenu className="scrollable-menu">
                    {files.map((file, index) => (
                        <DropdownItem 
                            key={index}
                            onClick={() => setSelectedFile(file)}
                        >
                            {file}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
            </div>

            {/* Download button */}
            <div style={{marginLeft:'120px',padding: '10px'}}>
            <Button color="success" onClick={handleDownload}  >Download</Button>
            </div>
            <div className='d-flex mt-1'style={{ paddingLeft: '20px',paddingTop:'13px',paddingRight:'40px' }}>
                <FormGroup check>
                    <Label check>
                        <Input type="checkbox" onChange={() => setEnableProjection(prev => !prev)} checked={enableProjection} />
                        Enable Projection
                    </Label>
                </FormGroup>
            </div>
            {!enableProjection && (
                    <div className='d-flex mt-2'>
                        <FormGroup style={{ paddingRight: '20px', paddingLeft:'35px' }}>
                            <Label>Maximum Intensity Percentile</Label>
                            <Input type="number"min="0"max="100" value={maxIntensityPercentile} onChange={(e) => setMaxIntensityPercentile(e.target.value)} />
                        </FormGroup>
                        <FormGroup className="ml-2" style={{ paddingRight: '20px', width: '200px' }}>
                            <Label>Smoothness: <strong>{smoothness}</strong></Label>
                            <Input 
                                type="range" 
                                id="smoothness-slider" 
                                min={0} 
                                max={2} 
                                step={0.1} 
                                value={smoothness} 
                                onChange={(e) => setSmoothness(e.target.value)} 
                            />
                            {/* <Label className="mt-2">{smoothness}</Label> */}
                        </FormGroup>

                        <div style={{ paddingTop: '30px'}}>
                            <Button className="ml-2" color="primary" onClick={handleMaxProjection }>Run</Button>
                        </div>
                    </div>
                )}
            {enableProjection && (
                <div className='d-flex mt-2'>
                    <FormGroup style={{ paddingRight: '5px' }}>
                        <Label>Selected Intensity</Label>
                        <Input type="text" value={selectedIntensity} readOnly style={{ fontSize: '12px' }}/>
                    </FormGroup>
                    <FormGroup className="ml-2" style={{ paddingRight: '5px' }}>
                        <Label>Min-Intensity</Label>
                        <Input type="number" value={minIntensity} onChange={(e) => setMinIntensity(e.target.value)} style={{ fontSize: '12px' }}/>
                    </FormGroup>
                    <FormGroup className="ml-2" style={{ paddingRight: '5px' }}>
                        <Label>Max-Intensity</Label>
                        <Input type="number" value={maxIntensity} onChange={(e) => setMaxIntensity(e.target.value)} style={{ fontSize: '12px' }}/>
                    </FormGroup>
                    <FormGroup className="ml-2" style={{ paddingRight: '20px', width: '200px' }}>
                            <Label>Smoothness: <strong>{smoothness}</strong></Label>
                            <Input 
                                type="range" 
                                id="smoothness-slider" 
                                min={0} 
                                max={2} 
                                step={0.1} 
                                value={smoothness} 
                                onChange={(e) => setSmoothness(e.target.value)} 
                            />
                            {/* <Label className="mt-2">{smoothness}</Label> */}
                        </FormGroup>
                    <div style={{ paddingTop: '30px'}}>
                    <Button className="ml-2"  color="primary" outline onClick={handleProjection}>Project</Button>
                    </div>
                </div>
            )}
            <div className='d-flex mt-1'style={{ paddingLeft: '20px',paddingTop:'13px',paddingRight:'40px' }}>
                <FormGroup check>
                    <Label check>
                        <Input type="checkbox" onChange={() => setRemoveBoundary(prev => !prev)} checked={removeBoundary} />
                        <strong>Remove Boundary</strong>
                    </Label>
                </FormGroup>
            </div>
            </div>
            
            {/* Display the selected file */}
            <DisplayFile fileName={selectedFile} smooth={smoothness}
            maxPercentile={maxIntensityPercentile} 
            runClicked={runClicked} 
            removeBoundary={removeBoundary} 
            onRunProcessed={() => {setRunClicked(false);}}
            setIntensity={setSelectedIntensity}
            projectClicked={projectClicked}
            onProjectProcessed={() => {setProjectClicked(false);}}
            min={minIntensity}
            max={maxIntensity}
            session_id = {sessionId}
            ></DisplayFile>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'left', paddingLeft: '20px' }}>
                <Button 
                    color="warning" 
                    onClick={() => window.open("https://www.youtube.com/channel/UC5tUZiZHCjS33Un4yxfIWdw ", "_blank")}
    
                > 
                    <i className="bi bi-youtube"></i> Click here to open YouTube tutorials
                </Button>
            </div>
            <div style={{  textAlign: 'left',paddingLeft: '50px',paddingTop:'1px' }}>
                <Button 
                    color="warning" 
                    onClick={() => window.open(" https://www.imaging-metabolomics.com/", "_blank")}
                > 
                <img src={logo} alt="Sun's Lab" style={{ width: '15px',height:'15px',marginRight: '8px' }}/> Go to Sun's Lab
                </Button>
            </div>
            </div>
        </div>
    );
}

export default ListFiles;
