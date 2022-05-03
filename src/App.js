//import logo from './logo.svg';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import React, { useState, useRef, useCallback } from 'react'
import MapGL, { Marker, GeolocateControl } from 'react-map-gl'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxGeocoder from 'react-map-gl-geocoder'


const MAPBOX_TOKEN = 'pk.eyJ1IjoiamFuc3RvcG90IiwiYSI6ImNsMjM4ZDltNTFud3kzZHFvcHpld3R2YXYifQ.CgvR_nt6utsQYIDUzwJKsA'


const App = () => {


  const [viewport, setViewport] = useState({});
  const mapRef = useRef();
  const geocoderContainerRef = useRef();
  
  const i = 1
  let mousePosition

  const [myLocation, setMyLocation] = useState()
  const [keyGen, setKeyGen] = useState(i)
  const [distanceToMarker, setDistanceToMarker] = useState(null)
  const [markersList, setMarkersList] = useState([])

  
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );



  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      //const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        //...geocoderDefaultOverrides
      });
    },
    []
  );


  function createMarker(x){

    setKeyGen(keyGen + 1)

    const you = new mapboxgl.LngLat(myLocation.lng, myLocation.lat);
    const point = new mapboxgl.LngLat(x[0], x[1]);
    const distance = Math.round(you.distanceTo(point))
    setDistanceToMarker(distance)
    
    
    const currentMarker = {
      key : keyGen,
      lng : x[0],
      lat : x[1],
      distance : distance
      }
    
    setMarkersList([...markersList, currentMarker])
    
    console.log("THE LIST",markersList)
    
  }

  function order(){
    const newArr = [...markersList]
    newArr.sort((a,b) => {return a.distance - b.distance})
    setMarkersList(newArr)
  }

  function clearMarkers(){
    setMarkersList([])
    setKeyGen(1)
  }


  return (
    <div style={{ height: "100vh" }}>
      <div
        ref={geocoderContainerRef}
        style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}
      />



    <div>        
        <MapboxGeocoder
          mapRef={mapRef}
          containerRef={geocoderContainerRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          //position="top-left"
          //marker = "true"
          mapboxgl = "mapboxgl"
          onResult = {(e) => {
            console.log(e)
            createMarker(e.result.center)
          }}
        />
    </div>

    <MapGL
        ref={mapRef}
        {...viewport}
        width="75%"
        height="75%"
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onMouseMove={(e)=>{
          mousePosition = e.lngLat
        }}
        onClick={()=>{
          createMarker(mousePosition)
        }}
      >



      <div className='locationButton'>
        <GeolocateControl
          positionOptions= {
            {enableHighAccuracy: true}
            }
          trackUserLocation= "true"
          showUserHeading = "true"
          onGeolocate = {(e) => {
            setMyLocation({
              lng : e.coords.longitude,
              lat : e.coords.latitude
              })
            }}
        />
      </div>
      
      <div className='info'> Distance to you {distanceToMarker} m </div>

      <div>
            {
            markersList.map(m => (
              <div key={m.key}>

                <Marker
                  latitude={m.lat}
                  longitude={m.lng}
                >
                  <img className='icon' src="/images/icons8-kawaii-pizza-48.png" alt='pizza'/>
                  <b>{m.key}</b> <br></br> <div style={{color: "red"}}>{m.distance} m</div>
                </Marker>

            </div>

            )) 
            }
      </div>

    </MapGL>



      <div>
          <button className='button' onClick={clearMarkers}>CLEAR MARKERS</button>
      </div>

      <div>
          <button className='button' onClick={order}>SORT MARKERS (min to max)</button>
      </div>

      <div className='list'>
        {
        markersList.map(m => (
          <ul key = {m.key}>
            <b>{m.key}</b> {m.distance} m
          </ul>
        ))
        } 
      </div>

    </div>
  );
}


export default App;
