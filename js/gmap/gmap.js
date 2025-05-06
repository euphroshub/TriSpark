// import Store
import { Store } from '../store/store';

let colors = {
    currentInfoWindow: null,
    colors: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
  };
  
  /* ---------------------------------------------------- */
  // GMap
  export class GMap {
      constructor(options) {
          this.options = options;
      }
  
      static get colors() {
          return colors;
      }
  
      static loadGoogleMap() {
          let map = document.getElementsByClassName('js-map')[0];
  
          if (map && !Store.mapIsLoaded) {
              let script = document.createElement('script');
              let GoogleMapAPI = new Promise((resolve, reject) => {
                  Store.app.theBody.appendChild(script);
                  script.onload = resolve;
                  script.onerror = reject;
                  script.async = true;
                  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + map.getAttribute('data-api') + '&language=' + map.getAttribute('data-language');
                  script.id = 'googlemap';
              });
  
              GoogleMapAPI.then(() => {
                  Store.mapIsLoaded = true;
                  GMap.init();
              });
  
              return
          }
  
          GMap.init();
      }
  
      static init() {
          let index = 0;
          let maps = document.getElementsByClassName('js-map');
  
          // if there is at least one map present, continue
          if (maps.length > 0) {
              for (let i = 0; i < maps.length; i++) {
                  let map = maps[i];
  
                  // params
                  let positionCollection = [];
                  let primaryPosition = null;
  
                  // settings
                  let zoom = null;
                  if (map.dataset.zoom)
                      zoom = parseInt(map.dataset.zoom)
  
                      let colored = colors.colors;
                  if (map.dataset.colored != 1)
                      colored = 0;
  
                      let marker = map.dataset.marker;
                  if (map.dataset.marker != 1)
                      marker = 0;
  
                      // @TODO mettre ca à 0 comme les autres variables ?
                  let ui = true;
                  if (map.dataset.ui != 1)
                      ui = false
  
                      // @TODO mettre ca à 0 comme les autres variables ?
                  let fitbound = true;
                  if (map.dataset.fitbound != 1)
                      fitbound = false
  
                      // if there is a provided address
                  let address = map.dataset.addr;
                  let dataLat = '';
                  let dataLng = '';
                  let html = map.firstElementChild;
                  let img = map.dataset.img;
  
                  // collection of markers
                  let markerCollection = [];
  
                  // bool for multiple markers
                  let multipleMarkers = false;
  
                  if (map.dataset.lat != '' && map.dataset.lng != "") {
                      dataLat = map.dataset.lat;
                      dataLng = map.dataset.lng;
                  }
  
                  // generate position object with the primary position
                  let primaryPositionObject = {
                      primary: 1,
                      address: address,
                      dataLat: dataLat,
                      dataLng: dataLng,
                      html: html,
                      img: img,
                  };
  
                  // if the map has multiple markers, setup a collection of marker
                  let markers = map.getElementsByTagName('li');
  
                  if (markers.length > 0) {
                      // if the map is not set to show all the markers, center on the first one
                      if (!fitbound) {
                          markerCollection.push(primaryPositionObject);
                      }
  
                      // get infos for each marker
                      for (let j = 0; j < markers.length; j++) {
                          let m = markers[j];
  
                          // get the marker infos
                          primaryPositionObject.primary = 0;
                          markerCollection.push({
                              primary: 0,
                              address: m.dataset.addr,
                              dataLat: m.dataset.lat,
                              dataLng: m.dataset.lng,
                              html: m.innerHTML,
                              img: m.dataset.img
                          });
                      }
                  }
  
                  // create the Map object with all it's properties
                  let options = {
                      element: map,
                      positionCollection: positionCollection,
                      primaryPosition: primaryPosition,
                      zoom: zoom,
                      colored: colored,
                      marker: marker,
                      ui: ui,
                      fitbound: fitbound,
                      address: address,
                      dataLat: dataLat,
                      dataLng: dataLng,
                      html: html,
                      infoWindow: null,
                      img: img,
                      markerCollection: markerCollection,
                      multipleMarkers: multipleMarkers,
                      primaryPositionObject: primaryPositionObject,
                  };
  
                  let obj = new GMap(options);
                  Store.mapItems.push(obj);
                  obj.build();
              }
          }
      }
  
      // ** locate_using_address ** //
      static locateUsingAddress(MAP, options, multiple = false) {
          let geocoder = new google.maps.Geocoder();
          let primaryPositionObject = options.primaryPositionObject;
          let primaryPositionObjectPrimary = primaryPositionObject.primary;
          let primaryPositionObjectAddress = primaryPositionObject.address;
          let positionCollection = options.positionCollection;
          let fitbound = options.fitbound;
          let markerCollection = options.markerCollection;
  
          // if multiple markers
          if (options.multipleMarkers) {
              for (let i = 0; i < markerCollection.length; i++) {
                  primaryPositionObjectAddress = markerCollection[i];
                  geocoder.geocode({'address': primaryPositionObjectAddress.address}, (results, status) => {
                      // If geocoding successfull
                      if (status === google.maps.GeocoderStatus.OK) {
                          let multipleMarkers = options.multipleMarkers;
  
                          // Place a marker using address
                          if (multipleMarkers == false && primaryPositionObjectPrimary || (multipleMarkers && !primaryPositionObjectPrimary)) {
                              let theMarker = new google.maps.Marker({
                                  map: MAP,
                                  position: results[0].geometry.location,
                                  icon: primaryPositionObject.img,
                              });
  
                              let popout = new google.maps.InfoWindow({
                                  content: options.markerCollection[i].html
                              });
  
                              let context = {
                                  MAP: MAP,
                                  options: options,
                                  popout: popout,
                                  theMarker: theMarker,
                              }
  
                              theMarker.addListener('click', GMap.togglePopout.bind(context));
                          }
  
                          // Set the collection of theMarker or the primary position
                          if (primaryPositionObjectPrimary) {
                              options.primaryPosition = results[0].geometry.location;
                          } else {
                              options.positionCollection.push(results[0].geometry.location);
                          }
  
                          GMap.setCenterMap(MAP, options);
                      }
  
                      // If geocoding unsuccessful from provided address 
                      // (ex: no address provided), Use provided lat-lng instead.
                      else { 						
                          //currentMapWrap.hide();
                          if(positionObject.dataLat != "" && positionObject.dataLng != "" && positionObject.dataLat != undefined && positionObject.dataLng != undefined){
                              GMap.locateUsingCoords(MAP, options); 
                          } else{
                              currentMapWrap.style.display = 'none';
                          }
                      }
                  });
              }
          } 
          // if single marker
          else {
              geocoder.geocode({'address': primaryPositionObjectAddress}, (results, status) => {
                  // If geocoding successfull
                  if (status === google.maps.GeocoderStatus.OK) {
                      let multipleMarkers = options.multipleMarkers;
  
                      // Place a marker using address
                      if (multipleMarkers == false && primaryPositionObjectPrimary || (multipleMarkers && !primaryPositionObjectPrimary)) {
                          let theMarker = new google.maps.Marker({
                              map: MAP,
                              position: results[0].geometry.location,
                              icon: primaryPositionObject.img,
                              optimized: false,
                              zIndex: 999,
                          });
  
                          let popout = new google.maps.InfoWindow({
                              content: options.html
                          });
  
                          let context = {
                              MAP: MAP,
                              options: options,
                              popout: popout,
                              theMarker: theMarker,
                          }
  
                          theMarker.addListener('click', GMap.togglePopout.bind(context));
                      }
  
                      // Set the collection of theMarker or the primary position
                      if (primaryPositionObjectPrimary) {
                          options.primaryPosition = results[0].geometry.location;
                      } else {
                          options.positionCollection.push(results[0].geometry.location);
                      }
  
                      GMap.setCenterMap(MAP, options);
                  }
                  // If geocoding unsuccessful from provided address 
                  // (ex: no address provided), Use provided lat-lng instead.
                  else { 
                      console.log('error');
                      // console.log(currentMapWrap.attr("class")+" -> Geocoding unsuccessful ("+positionObject.address+"); " + status); 
                      
                      //currentMapWrap.hide();
                      // if(positionObject.dataLat != "" && positionObject.dataLng != "" && positionObject.dataLat != undefined && positionObject.dataLng != undefined){
                      // 	GMap.locateUsingCoords(MAP, options); 
                      // } else{
                      // 	currentMapWrap.style.display = 'none';
                      // }
                  }
              });
          }
      }
  
      static togglePopout() {
          let MAP = this.MAP;
          let options = this.options;
          let popout = this.popout;
          let infoWindow = options.infoWindow;
          let theMarker = this.theMarker;
  
          if (infoWindow) {
              infoWindow.close();
          }
  
          infoWindow = popout;
          popout.open(MAP, theMarker);
      }
  
      // ** locate_using_coords ** //
      static locateUsingCoords(MAP, options, multiple = false) {
          // If lat lng are provided
          lat_lng = { lat: positionObject.dataLat, lng: positionObject.dataLng};	
  
          // Recenter map using coords
          // set_center_map(map,lat_lng);
          // Place a marker using coords
          if (markerBool == 1 && ((!multiple_markersBool && positionObject.primary) || (multiple_markersBool && !positionObject.primary))) {
              let marker = new google.maps.Marker({
                  map: map,
                  position: lat_lng,
                  icon: positionObject.img,
                  content: positionObject.html
              });
  
              // If html is not empty fo a info window
              if (positionObject.html != "") {	      	  	
                  let infowindow = new google.maps.InfoWindow({
                      content: positionObject.html,
                  });
                  
                  marker.addListener('click', function() {
                      if (current_infoWindow) {
                          current_infoWindow.close();
                      }
  
                      current_infoWindow = infowindow;
                      infowindow.open(resultsMap, marker);
                  });
              }
          }
  
          // Set the collection of marker or the primary position
          if (positionObject.primary) {
              primary_position = lat_lng;
          } else {
              position_collection.push(lat_lng);
          }
  
          GMap.setCenterMap(MAP,options);
      }
  
      // ** set_center_map ** //
      static setCenterMap(MAP, options) {
          let positionCollection = options.positionCollection;
          let primaryPosition = options.primaryPosition;
          let fitbound = options.fitbound;
  
          // If position_collection have more than one position and set to fitbound
          if (positionCollection.length > 0 && fitbound == true) {
              let bound = new google.maps.LatLngBounds();
  
              // Loop on all position
              for (let i = 0; i < positionCollection.length; i++) {
                  bound.extend(positionCollection[i]);
              }
  
              MAP.fitBounds(bound);
          } else {
              MAP.setCenter(primaryPosition);
          }
      }
  
      static showGoogleMap() {
          let map = this.options.element;
          map.style.opacity = '1';
          // const mapWrapper = Store.app.theContainer.getElementsByClassName('js-mapWrapper');
          // mapWrapper[0].classList.add('isVisible');
      }
  
      // ** build ** //
      build() {
          let options = this.options;
          let element = options.element
          // build a new map
          let MAP = new google.maps.Map(element, {
              zoom: options.zoom,
              center: { lat: 0, lng: 0 },
              scrollwheel: false, 
              styles : options.colored,
              zoomControl: true,
              mapTypeControl: true,
              scaleControl: options.ui,
              streetViewControl: false,
              rotateControl: options.ui,
              fullscreenControl: options.ui
  
          });
  
          // if the map has multiple markers
          if (options.markerCollection.length > 0) {
              let multiple = true;
              options.multipleMarkers = true;
              GMap.locateUsingAddress(MAP, options, multiple);
          } 
  
          // if the map has a single marker
          if (options.markerCollection.length == 0) {
              // initiate geocoding from map's data address, if provided
              if (options.address != "" && options.address != undefined) {
                  GMap.locateUsingAddress(MAP, options);
              }
              // If not, use coordinates
              else if (options.dataLat != "" && options.dataLng != "" && options.dataLat != undefined && options.dataLng != undefined) {
                  GMap.locateUsingCoords(MAP, options);
              } else {
                  console.log('La map', options.element, 'n\'a pas suffisamment d\'information pour faire une geolocalisation');
                  options.element.style.opacity = '0';
              }
          }
  
          google.maps.event.addListenerOnce(MAP, 'tilesloaded', GMap.showGoogleMap.bind(this));
      }
  } 