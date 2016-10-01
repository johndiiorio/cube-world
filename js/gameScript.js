var camera, scene, renderer, player, gem, boxGeometry, enemyMaterial;
var mouse = new THREE.Vector2();
var enemies = [];
var enemySpeed = 3;
var numBoxes, addedBoxes;
var scoreDiv = document.getElementById( "score" );
var bestScoreDiv = document.getElementById( "bestScore" );
var sphereRadius = 10;
var enemyRangeX = 625;
var enemyRangeY = 800;
var gemRange = 550;

init();
animate();

function init() {
	// renderer
	var container = document.getElementById( "container" );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( container.clientWidth, container.clientHeight );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );
	// camera
	camera = new THREE.PerspectiveCamera( 70, container.clientWidth / container.clientHeight, 1, 1000 );
	camera.position.z = 400;
	// scene
	scene = new THREE.Scene();
	// mesh properties
	var circleGeometry = new THREE.SphereGeometry( sphereRadius );
	boxGeometry = new THREE.BoxGeometry(35, 35, 35);
	var gemGeometry = new THREE.BoxGeometry(15, 15, 15);


	var crateTexture = THREE.ImageUtils.loadTexture( 'textures/crateTexture.jpg' );
	crateTexture.anisotropy = renderer.getMaxAnisotropy();
	enemyMaterial = new THREE.MeshBasicMaterial( { map: crateTexture } );


	var gemTexture = THREE.ImageUtils.loadTexture( 'textures/gemTexture.jpg' );
	gemTexture.anisotropy = renderer.getMaxAnisotropy();
	var gemMaterial = new THREE.MeshBasicMaterial( { map: gemTexture } );


	// enemies
	nBoxes = 15;
	for (var i = 0; i < nBoxes; i++) {
		var mesh = new THREE.Mesh( boxGeometry, enemyMaterial );
		mesh.position.set(enemyRangeX/2 - enemyRangeX * Math.random(), enemyRangeY/2 - enemyRangeY * Math.random(), 0.0);
		scene.add(mesh);
		enemies.push(mesh);
	}
	// gem
	gem = new THREE.Mesh(gemGeometry, gemMaterial);
	gem.position.set(gemRange/2 - gemRange * Math.random(), gemRange/2 - gemRange * Math.random(), 0.0);
	scene.add(gem);
	// player
	player = new THREE.Mesh(circleGeometry, new THREE.MeshBasicMaterial());
	scene.add(player);
	container.addEventListener('mousemove', onMouseMove, false);
}
function onMouseMove( event ) {
	mouse.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
	mouse.y = - ( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;
	player.position.set( 275 * mouse.x, 275 * mouse.y, 0.0 );
}
function animate() {
	requestAnimationFrame(animate);
	// update enemies
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].position.y < -enemyRangeY/2) { // if the enemy has moved below the container
			enemies[i].position.x = enemyRangeX/2 - enemyRangeX * Math.random(); //set new x-coord for variety
			enemies[i].position.y = enemyRangeY/2; // set y-coord at top of container
		} else {
			if ( enemies[i].position.distanceTo( player.position ) < 3 * sphereRadius) { // if there's a player-enemy collision
				scoreDiv.innerHTML = "0"; //reset score	
			}
			enemies[i].position.y -= enemySpeed; // translate enemy downwards
			enemies[i].rotation.x += 0.05 * Math.random();
			enemies[i].rotation.y += 0.05 * Math.random();
		}
	}
	// check for player-gem collision
	if ( player.position.distanceTo( gem.position ) < 2 * sphereRadius ) {
		gem.position.x = gemRange/2 - gemRange * Math.random(); // give the gem a random xy coord
		gem.position.y = gemRange/2 - gemRange * Math.random();
		var score = Number(scoreDiv.innerHTML) + 1; // increase score
		scoreDiv.innerHTML = score.toString();
		var best = bestScoreDiv.innerHTML.split(' ');
		if ( score > Number( best[1] ) ) {
			bestScoreDiv.innerHTML = best[0] + " " + score.toString();
		}
		//Add another enemy
		var mesh = new THREE.Mesh( boxGeometry, enemyMaterial );
		mesh.position.set(enemyRangeX/2 - enemyRangeX * Math.random(), enemyRangeY/2, 0.0);
		scene.add(mesh);
		enemies.push(mesh);
		addedBoxes += 1;
	}
	gem.rotation.x += 0.1 * Math.random();
	gem.rotation.y += 0.1 * Math.random();
	gem.rotation.z += 0.1 * Math.random();

	renderer.render( scene, camera );
}