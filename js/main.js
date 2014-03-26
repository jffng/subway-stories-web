$(document).ready(function() {
  $('body').append('<div id="instructions"><span style="font-size:32px"> Subway Stories </span><br><br>An interactive storytelling experience<br><br>Click anywhere on the screen to start<br><br>Use arrow or w,a,s,d keys to explore<br><br>By <a href="http://animishmish.com" target="_blank">Alon Chitayat</a> & <a href="http://jffng.com" target="_blank">Jeff Ong</a>.<br><br></div>');
  $('#instructions').click( function() {
    instructions();
  });

    init();
    initAudio();
    animate();
});

var graphicsFlag;
var camera, scene, renderer, audio;
var subwayCar, passengers, background, poles, polesB;
var controls, noise, time = Date.now();
var mouseX = 0, mouseY = 0,
windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2;

function init() {
  $('body').append('<div id="container"></div>');
  $('#container').append('<div id="info"></div>');
  $('#info').addClass('info');
  passengers_loaded = false;
  poles_loaded = false;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  $('#container').append(renderer.domElement);

  addGraphics();
}

function addGraphics () {
	  // camera 
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000); 
    camera.position.set(-20, 0, 1500);
    camera.lookAt(0,0,0); 

    // scene 
    scene = new THREE.Scene();
    subwayCar = new subwayCarLoader();

    // data structures
    poles = [];
    polesB = [];
    background = [];
    passengers = new passengerObject();

    for (var i = 1; i < 25; i++){
      passengerLoader(i);
      if(i%4 === 0){
        img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
          map:THREE.ImageUtils.loadTexture('img/pole.png')
        });
        img.map.needsUpdate = true; //ADDED
        img.transparent = true;
        var pole = new THREE.Mesh(new THREE.PlaneGeometry(12, 200), img);
        scene.add(pole);
        pole.position.set(i*90 - 1410, 0, -40);
      }
    }

    scene.add(passengers.object3D);

    for (var i = 0; i < 8; i++){
      poles[i] = new Pole(i*750-1000, 120, 150, 700, 0x333333);
      polesB[i] = new Pole(i*750-1500, 160, -100, 750, 0x121212);
    }

    for(var i = 0; i < 6; i++){
      background[i] = new Background(i);
    }

    var geometry = new THREE.PlaneGeometry(20000, 700);
    var material = new THREE.MeshBasicMaterial({ color: 0x111111 });
    var tunnel = new THREE.Mesh( geometry, material );
    scene.add( tunnel );
    tunnel.position.set( 0, 185, -102)

    // LIGHTS
    var ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    window.addEventListener( 'resize', onWindowResize, false );

    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );
  }

subwayCarLoader = function () {
    var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
      map:THREE.ImageUtils.loadTexture('img/full_subway_20_windows.png')
    });
    img.map.needsUpdate = true; //ADDED
    img.transparent = true;
    this.subwayMesh = new THREE.Mesh(new THREE.PlaneGeometry(3500, 397), img);
    scene.add(this.subwayMesh);
    this.subwayMesh.position.y = -25;
}

subwayCarLoader.prototype.setPos = function(timer) {
  var noise = (.5-Math.random())*.05*(Date.now() - timer);
  this.subwayMesh.position.y += noise;
  this.subwayMesh.position.y = Math.min(Math.max(-30,this.subwayMesh.position.y),-20); 
}

passengerObject = function() {
  this.object3D = new THREE.Object3D;
}

passengerObject.prototype.setPos = function(timer) {
  var noise = (.5-Math.random())*.05*(Date.now() - timer);
  this.object3D.position.y += noise;
  this.object3D.position.y = Math.min(Math.max(-5,this.object3D.position.y),5); 
}

passengerLoader = function (numPassengers) {
    var img = new THREE.MeshBasicMaterial({
      map:THREE.ImageUtils.loadTexture('img/subway_'+numPassengers+'.png')
    })
    img.map.needsUpdate = true; //ADDED
    img.transparent = true;

    switch( numPassengers ){
      case 2:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(100,140), img );
        this.passengerMesh.position.set(numPassengers*110 - 1410, -35, -50);
        passengers.object3D.add(this.passengerMesh);
        break;

      case 3:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
        this.passengerMesh.position.set(numPassengers*110 - 1420, -55, -50);
        passengers.object3D.add(this.passengerMesh);
        break;

      case 4:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
        this.passengerMesh.position.set(numPassengers*110 - 1420, -40, -50);
        passengers.object3D.add(this.passengerMesh);
        break;

      case 5:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
        this.passengerMesh.position.set(numPassengers*110 - 1420, -35, -50);
        passengers.object3D.add(this.passengerMesh);
        break;

      case 6:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
        this.passengerMesh.position.set(numPassengers*110 - 1455, -40, -50);
        passengers.object3D.add(this.passengerMesh);
        break;
 
      case 7:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(100,135), img );
        this.passengerMesh.position.set(numPassengers*110 - 1415, -40, -50);
        passengers.object3D.add(this.passengerMesh);
        break;

      case 17:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
        this.passengerMesh.position.set(numPassengers*110 - 1430, -40, -50);
        passengers.object3D.add(this.passengerMesh);
        break;

      case 21:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
        this.passengerMesh.position.set(numPassengers*110 - 1430, -40, -50);
        passengers.object3D.add(this.passengerMesh);
        break;
      
      case 22:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
        this.passengerMesh.position.set(numPassengers*110 - 1440, -40, -50);
        passengers.object3D.add(this.passengerMesh);
        break;
      
      case 23:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
        this.passengerMesh.position.set(numPassengers*110 - 1480, -40, -50);
        passengers.object3D.add(this.passengerMesh);
        break;

      case 24:  
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
        this.passengerMesh.position.set(numPassengers*110 - 1440, -50, -50);
        passengers.object3D.add(this.passengerMesh);
        break; 

      default:
        this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
        this.passengerMesh.position.set(numPassengers*110 - 1400, -40, -50);
        passengers.object3D.add(this.passengerMesh);  
        break;
      }      
}

  function Background(num){

    var img = new THREE.MeshBasicMaterial({
      map:THREE.ImageUtils.loadTexture('img/subway_tile_wall.jpg')
    });
    img.map.needsUpdate = true;

    var geometry = new THREE.PlaneGeometry(1200, 695);
    this.tile = new THREE.Mesh( geometry, img);
    scene.add(this.tile);
    this.tile.position.set(num*1200, 185, -100); 
  }

  Background.prototype.setPos = function(timer, speed){
    var delta = .8*(Date.now() - timer);
    this.tile.position.x -= delta;
    if(this.tile.position.x <= -14400) this.tile.position.x += 28800;
  }

  function Pole(x,y,z,h,c) {
    var geometry = new THREE.CubeGeometry( 120, h, 50 );
    var material = new THREE.MeshBasicMaterial( {color: c} );
    this.cube = new THREE.Mesh( geometry, material );
    scene.add(this.cube);
    this.cube.position.set(x, y, z);
  }

  Pole.prototype.setPos = function(timer, speed) {
    var delta = (Date.now() - timer);
    this.cube.position.x -= delta*speed;
    if(this.cube.position.x < -3000) this.cube.position.x += 6000;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function instructions() {
    document.getElementById('instructions').style.display = 'none';
  }

  function render () {
    // if(graphicsFlag == true){
      controls.update();

      for(var i = 0; i < poles.length; i++){ 
        poles[i].setPos(time, 1.2);
        polesB[i].setPos(time, .9);
      }

      for(var i = 0; i < background.length; i++){
        background[i].setPos(time);
      }

      passengers.setPos(time);
      subwayCar.setPos(time);
      if(audioLoaded == true ) updateAudio();

      renderer.render(scene,camera);
      time = Date.now();
    // }
}

function animate () {
 requestAnimationFrame( animate );
 render();
}