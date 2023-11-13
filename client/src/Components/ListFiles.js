import React, { useState, useEffect,useRef } from 'react';
import DisplayFile from './DisplayFile.js';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Input, Label, FormGroup} from 'reactstrap';
import '../App.css'

function ListFiles() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); // State to track the selected file
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for toggling the dropdown
    const initialRender = useRef(true);
    const [firstRender,setFirstRender] = useState(true);
    const [enableProjection, setEnableProjection] = useState(false);
    const [removeBoundary, setRemoveBoundary] = useState(false);
    const [selectedIntensity, setSelectedIntensity] = useState(''); // This won't be editable
    const [minIntensity, setMinIntensity] = useState('');
    const [maxIntensity, setMaxIntensity] = useState('');
    const [maxIntensityPercentile, setMaxIntensityPercentile] = useState('99');
    const [smoothness, setSmoothness] = useState(0);
    const [runClicked, setRunClicked] = useState(false);
    const [projectClicked, setProjectClicked] = useState(false);

    const handleProjection = () => {
        setProjectClicked(true);
        console.log("Project clicked")
    };

    const handleMaxProjection = () => {
        setRunClicked(true);
        console.log("Run clicked")
    };

    useEffect(() => {
        fetch('/api/listfiles')
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

    const handleDownload = async () => {
        if (!selectedFile) {
            console.error("No file selected for download.");
            return;
        }
    
        // Define the URL where the file is being served
        const fileURL = `http://localhost:3001/Original/${selectedFile}`;
    
        try {
            const response = await fetch(fileURL);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = selectedFile; // Set the file name. Default is the URL's filename.
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error.message);
        }
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
            ></DisplayFile>
        </div>
    );
}

export default ListFiles;
