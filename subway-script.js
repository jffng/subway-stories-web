var camera, scene, renderer;
var controls, time = Date.now();
var mouseX = 0, mouseY = 0,
windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2;

// Vectors = function() {
//     this.velocity = 0;
//     this.acceleration = 0;
// }

// Vectors.prototype.update = function(force) {
//     this.acceleration = force;
//     this.velocity = this.acceleration;
//     camera.position.x += this.velocity;
//     this.acceleration = 0;
// }

Passenger = function(num) {
    this.position.set(num)
}

function init () {
	$('body').append('<div id="container"></div>');
	$('#container').append('<div id="info"></div>');
	$('#info').addClass('info');
	$('#info').html("Subway Stories: <br> An Interactive Storytelling Platform");

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	$('#container').append(renderer.domElement);

	addImagery();
}

// function update () {
//     camVec = new Vectors;
//     if ( keyboard.pressed("left") ){

//             console.log('accel');
//             camVec.update(-0.025);
//         };
//     if ( keyboard.pressed("right") ){

//             console.log('decel');
//             camVec.update(0.025);
//         };
// }

function addImagery () {
	// camera 
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000); 
    // camera.position.y = -250; 
    camera.position.z = 1500; 

    // scene 
    scene = new THREE.Scene();

    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );

    var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
        map:THREE.ImageUtils.loadTexture('img/subway_car.png')
    });
    img.map.needsUpdate = true; //ADDED
    img.transparent = true;

    // plane
    var subwayMesh = new THREE.Mesh(new THREE.PlaneGeometry(2700, 397),img);
    // plane.overdraw = true;
    scene.add(subwayMesh);

    for (var i = 1; i < 25; i++){
        passengers(i);
    }

    var geometry = new THREE.PlaneGeometry(5000, 800);
    var material = new THREE.MeshBasicMaterial( {color: 0x222222} );
    var background = new THREE.Mesh( geometry, material );
    scene.add(background);
    background.position.z = -100;
	background.position.y = 100;

     // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    // add directional light source
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // create wrapper object that contains three.js objects
    var three = {
        renderer: renderer,
        camera: camera,
        scene: scene,
        subway_car: subwayMesh
    };

    window.addEventListener( 'resize', onWindowResize, false );
}

function passengers(num) {
    var img = new THREE.MeshBasicMaterial({
        map:THREE.ImageUtils.loadTexture('img/subway_'+num+'.png')
    })
    img.map.needsUpdate = true; //ADDED
    img.transparent = true;

    var passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
    passengerMesh.position.z = -50;
    passengerMesh.position.x = num*110 - 1400;
    scene.add(passengerMesh);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function render () {
    controls.update( Date.now() - time );

	renderer.render(scene,camera);

    time = Date.now();
}

function animate () {
	requestAnimationFrame( animate );
	render();
}

$(document).ready(function() {
    console.log("ready!");
    init();
    animate();
});