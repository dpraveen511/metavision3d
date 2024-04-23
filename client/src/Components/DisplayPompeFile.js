import React, { useState, useEffect } from 'react';
import {Niivue,NVImage} from '@niivue/niivue';
import { Container } from 'reactstrap';
function DisplayPompeFile(props) {

  const [isBoundaryLoaded,setBoundaryLoaded] = useState(true);
  const [initialRender,setInitialRender] = useState(true);
  const [nv1,setNv1] = useState(new Niivue({onLocationChange: handleIntensityChange,}))
  const [nv2,setNv2] = useState(new Niivue())
  const [nv3,setNv3] = useState(new Niivue({onLocationChange: handleIntensityChange,}))
  const [nv4,setNv4] = useState(new Niivue())
  const[nv2MainUrl,setNv2MainUrl] = useState('')
  const[nv1Url,setNv1Url] = useState(null)

  function runMaxProjection(){
    console.log("I ran");
    console.log(`http://localhost:3001/Inverted/${props.fileName}`)
    fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/max?fileName=${props.fileName}&max=${props.maxPercentile}&smooth=${props.smooth}&session_id=${props.session_id}&url=${process.env.REACT_APP_FLASK_API_URL}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.url) {
              var volumeList1 = null;
              if(isBoundaryLoaded && !props.removeBoundary) {
                setNv2MainUrl(data.url + `?nocache=${new Date().getTime()}`)
                console.log("here")
                 volumeList1 = [
                  {
                    url: `${process.env.REACT_APP_FLASK_API_URL}/data/Boundary/${props.fileName}`, // use the URL from the response
                    colormap: "gray",
                    opacity: 0.25,
                    visible: true,
                },
                    {
                        url: data.url + `?nocache=${new Date().getTime()}`, // use the URL from the response
                        colormap: "red",
                        opacity: 0.9,
                        visible: true,
                    }
                ];
              } else {
                setNv2MainUrl(data.url + `?nocache=${new Date().getTime()}`)
                volumeList1= [
                  {
                    url: data.url + `?nocache=${new Date().getTime()}`, // use the URL from the response
                    colormap: "red",
                    opacity: 0.9,
                    visible: true, 
                  }
                ];
              }
                nv2.loadVolumes(volumeList1);
                nv2.updateGLVolume();
            } else {
                console.error('URL not found in the response');
            }
        })
        .catch(error => {
            console.error('Error fetching the URL:', error);
        });

  }


  function runProjection(){
    console.log("Running Projection");
    fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/project?fileName=${props.fileName}&min=${props.min}&max=${props.max}&smooth=${props.smooth}&session_id=${props.session_id}&url=${process.env.REACT_APP_FLASK_API_URL}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.url) {
              var volumeList1 = null;
              if(isBoundaryLoaded && !props.removeBoundary) {
                setNv2MainUrl(data.url + `?nocache=${new Date().getTime()}`)
                console.log("here")
                 volumeList1 = [
                  {
                    url: `${process.env.REACT_APP_FLASK_API_URL}/data/Boundary/${props.fileName}`, // use the URL from the response
                    colormap: "gray",
                    opacity: 0.25,
                    visible: true,
                },
                    {
                        url: data.url + `?nocache=${new Date().getTime()}`, // use the URL from the response
                        colormap: "red",
                        opacity: 0.9,
                        visible: true,
                    }
                ];
              } else {
                setNv2MainUrl(data.url + `?nocache=${new Date().getTime()}`)
                volumeList1= [
                  {
                    url: data.url + `?nocache=${new Date().getTime()}`, // use the URL from the response
                    colormap: "red",
                    opacity: 0.9,
                    visible: true, 
                  }
                ];
              }
                nv2.loadVolumes(volumeList1);
                nv2.updateGLVolume();
            } else {
                console.error('URL not found in the response');
            }
        })
        .catch(error => {
            console.error('Error fetching the URL:', error);
        });
  }


  function handleIntensityChange(data) {
    console.log(data.values[0].value);
    props.setIntensity(data.values[0].value)
  }


  function nv2ImgLoad(){
    
  }


  useEffect(()=> {
    if(props.removeBoundary && !initialRender){
    var volumes = [
      {
        url: nv2MainUrl, // use the URL from the response
        colormap: "red",
        opacity: 0.9,
        visible: true, 
      }
    ];
    console.log(volumes)
    nv2.loadVolumes(volumes);
  } else if(!initialRender){
    console.log("Printing at the start of renderning")
    var volumeList1 = [
      {
        url: `${process.env.REACT_APP_FLASK_API_URL}/data/Boundary/${props.fileName}`, // use the URL from the response
        colormap: "gray",
        opacity: 0.2,
        visible: true,
    },
        {
            url: nv2MainUrl, // use the URL from the response
            colormap: "red",
            opacity: 0.9,
            visible: true,
        }
    ];
    nv2.loadVolumes(volumeList1);
  }
  },[props.removeBoundary])


  useEffect(() => {
    nv1.attachTo("gl1");
    nv2.attachTo("gl2");
    nv3.attachTo("gl3");
    nv4.attachTo("gl4");
    // nv2.setScale(4);
    // nv2.setClipPlane([270,-90])
    nv1.opts.isColorbar = true;
    nv3.opts.isColorbar = true;
    setInitialRender(!initialRender);
    }, []);


  useEffect(() => {
    if (props.runClicked) {
        runMaxProjection();
        props.onRunProcessed();
    }
    }, [props.runClicked]);


  useEffect(() => {
    if (props.projectClicked) {
        runProjection();
        props.onProjectProcessed();
    }
    }, [props.projectClicked]);
  
      
  useEffect(() => {
    if (props.fileName) {
      var volumeList1 = [
          {
            url: `${process.env.REACT_APP_FLASK_API_URL}/data/Inverted/${props.fileName}`,
            colormap: "actc",
            opacity: 1,
            visible: true,   
          }  
        ];
          
      nv1.onImageLoaded = function(volume){
        console.log('volume loaded');
      }
      var url = `${process.env.REACT_APP_FLASK_API_URL}/data/Inverted/${props.fileName}`
      console.log(url);
      if(nv1Url === null){
        console.log("nv1 is already loaded")
      }
      else{
        nv1.removeVolumeByUrl(nv1Url)
      }
      setNv1Url(url)
      // nv1.addVolumeFromUrl({url,colormap:"actc"})      
      nv1.loadVolumes(volumeList1);
      nv1.setSliceType(nv1.sliceTypeAxial);
      nv3.loadVolumes(volumeList1);
      nv3.setSliceType(nv1.sliceTypeAxial);

      fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/max?fileName=${props.fileName}&max=${props.maxPercentile}&smooth=${props.smooth}&session_id=${props.session_id}&url=${process.env.REACT_APP_FLASK_API_URL}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.url) {
              var volumeList1 = null;
              if(isBoundaryLoaded && !props.removeBoundary) {
                setNv2MainUrl(data.url + `?nocache=${new Date().getTime()}`)
                console.log("here")
                 volumeList1 = [
                  {
                    url: `${process.env.REACT_APP_FLASK_API_URL}/data/Boundary/${props.fileName}`, // use the URL from the response
                    colormap: "gray",
                    opacity: 0.25,
                    visible: true,
                },
                    {
                        url: data.url + `?nocache=${new Date().getTime()}`, // use the URL from the response
                        colormap: "red",
                        opacity: 0.9,
                        visible: true,
                    }
                ];
              } else {
                setNv2MainUrl(data.url + `?nocache=${new Date().getTime()}`)
                volumeList1= [
                  {
                    url: data.url + `?nocache=${new Date().getTime()}`, // use the URL from the response
                    colormap: "red",
                    opacity: 0.9,
                    visible: true, 
                  }
                ];
              }
                nv2.loadVolumes(volumeList1);
                nv2.updateGLVolume();
                nv4.loadVolumes(volumeList1);
                nv4.updateGLVolume();
            } else {
                console.error('URL not found in the response');
            }
        })
        .catch(error => {
            console.error('Error fetching the URL:', error);
        });
      // const cacheBuster = `?_${new Date().getTime()}`;
      // var volumeList2 = [
      //     {
      //       url: `${process.env.REACT_APP_FLASK_API_URL}/data/Inverted/${props.fileName}`,
      //       Name: 'UE',
      //       colormap: "actc",
      //       opacity: 0.5,
      //       visible: true,     
      //       },        
      //   ];
      // nv2.loadVolumes(volumeList2);
      // setNv2MainUrl(`${process.env.REACT_APP_FLASK_API_URL}/data/Inverted/${props.fileName}`)
      nv2.setSliceType(nv2.sliceTypeRender)
      nv4.setSliceType(nv2.sliceTypeRender);
          
    }
  }, [props.fileName]);

  
  return (
    <div class = "container ">
      <div class = "row"><div class="col"><hr style={{border:'none',height:'2px', backgroundColor:'black'}}/></div></div>
      <div className="row ">
      <div class="col-1 " style={{fontSize:'24px', fontWeight:'bold',marginRight:'14px'}}>Normal Brain</div>
      
          <div id="demo1" className="col-5 p-2" style={{ height: '300px'}}>
              <canvas id="gl1" style={{width: '500px', height: '400px'}}> </canvas>
          </div>
          <div class= "col-1" style={{width: '25px',backgroundColor:'white'}}></div>
          <div id="demo2" className="col-5 p-2" style={{ left:'70%',height: '300px'}}>
              <canvas id="gl2" style={{width: '400px', height: '400px'}}> </canvas>
          </div>
          
      </div>
      <div class = "row"><div class="col"><hr style={{border:'none',height:'1px', backgroundColor:'black'}}/></div></div>
      <div className="row">
      <div class="col-1 " style={{fontSize:'24px', fontWeight:'bold',marginRight:'14px'}}>Diseased Brain</div>
      
          <div id="demo3" className="col-5 p-2" style={{ height: '300px'}}>
              <canvas id="gl3" style={{ height: '400px'}}> </canvas>
          </div>
          <div class ="col-1" style={{width: '25px',backgroundColor:'white'}}></div>
          <div id="demo4" className="col-5 p-2" style={{ left:'70%',height: '300px'}}>
              <canvas id="gl4" style={{width: '400px', height: '400px'}}> </canvas>
          </div>
          
      </div>
      <div class = "row"><div class="col"><hr style={{border:'none',height:'2px', backgroundColor:'black'}}/></div></div>
      </div>
      
  );
}

export default DisplayPompeFile