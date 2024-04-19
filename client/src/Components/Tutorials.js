import React, { useState, useEffect,useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function Tutorials(){
    return (
    <div class="container my-4">
        <div class="row">
            <div class="col-12">
                <h2 class="text-center mb-4">Tutorials</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="video-responsive">
            
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/u5dQYSZw-fY?si=I5_WcxYgT0c4fcI0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            </div>
            <div class="col-md-6">
                <div class="video-responsive">
            
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/mvj_ehIT0MY?si=DINUEPM618sgd2ZN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    </div>
    );
}
export default Tutorials;