/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	// yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	// var isOnObject = false;
	// var canJump = false;

	var velocity = new THREE.Vector3();
	var acceleration = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	// var onMouseMove = function ( event ) {

	// 	if ( scope.enabled === false ) return;

	// 	var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	// 	var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

	// 	yawObject.rotation.y -= movementX * 0.002;
	// 	pitchObject.rotation.x -= movementY * 0.002;

	// 	pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	// };

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 10;
				canJump = false;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	// document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = true;

	this.getObject = function () {

		return yawObject;

	};

	// this.isOnObject = function ( boolean ) {

	// 	isOnObject = boolean;
	// 	canJump = boolean;

	// };

	// this.getDirection = function() {

	// 	// assumes the camera itself is not rotated

	// 	var direction = new THREE.Vector3( 0, 0, -1 );
	// 	var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

	// 	return function( v ) {

	// 		rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

	// 		v.copy( direction ).applyEuler( rotation );

	// 		return v;

	// 	}

	// }();

	this.update = function ( delta ) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		// velocity.x += ( - velocity.x ) * 0.08 * delta;
		// velocity.z += ( - velocity.z ) * 0.08 * delta;

		// velocity.y -= 0.25 * delta;

		if ( moveForward ) acceleration.z -= 0.08 * delta;
		if ( moveBackward ) acceleration.z += 0.08 * delta;

		if ( moveLeft ) acceleration.x -= 0.08 * delta;
		if ( moveRight ) acceleration.x += 0.08 * delta;

		// if ( isOnObject === true ) {

		// 	velocity.y = Math.max( 0, velocity.y );

		// }

		velocity.z += acceleration.z;
		velocity.x += acceleration.x;
		acceleration.z *= 0;
		acceleration.x *= 0;

		if (velocity.z == 0);
		else if (velocity.z < 0) velocity.z = Math.min(10, velocity.z ); 
		else if (velocity.z > 0) velocity.z = Math.max(-10, velocity.z ); 

		if (velocity.x == 0);
		else if (velocity.x < 0) velocity.x = Math.min(10, velocity.x ); 
		else if (velocity.x > 0) velocity.x = Math.max(-10, velocity.x ); 


		camera.position.x += velocity.x;
		camera.position.z += velocity.z;
		if(camera.position.x > 0) { camera.position.x = Math.min(camera.position.x, 3000);  }
		if(camera.position.x < 0) { camera.position.x = Math.max(camera.position.x, -3000); } 
		camera.position.z = Math.min(Math.max(camera.position.z, 200), 3000);

		velocity.x *= .99;
		velocity.z *= .99;
		// yawObject.translateX( velocity.x );
		// yawObject.translateY( velocity.y ); 
		// yawObject.translateZ( velocity.z );

		// if ( yawObject.position.y < 10 ) {

		// 	velocity.y = 0;
		// 	yawObject.position.y = 10;

		// 	canJump = true;

		// }

	};

};