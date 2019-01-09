//Global variables
var renderer, scene, camera, octoMain, particle;
var partNum = 1000;
var spread;
const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx, audioElement, source, analyser, bufferLength, dataArray;
var particlesStored = [];
var cubes = [];
var cube;
var cos = Math.cos;
var sin = Math.sin;



//Execute the main functions when the page loads
var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );


function init(){
  // overlay for new chrome autoplay t&s
  var overlay = document.getElementById( 'overlay' );
  overlay.remove();

//Audio handling
audioCtx = new AudioContext();
audioElement = document.querySelector('audio');
audioElement.play();
audioElement.volume = 0.1;
source = audioCtx.createMediaElementSource(audioElement)
analyser = audioCtx.createAnalyser();

source.connect(analyser);
source.connect(audioCtx.destination);

analyser.fftSize = 256;
bufferLength = analyser.frequencyBinCount;
console.log({ bufferLength })
dataArray = new Uint8Array(bufferLength);
analyser.getByteFrequencyData(dataArray);

  // Create an empty scene
  scene = new THREE.Scene();

  // Create a basic perspective camera
  camera = new THREE.PerspectiveCamera( 65, window.innerWidth/window.innerHeight, 1, 1000 );
  camera.position.z = 350;
  camera.position.x = 150;
    camera.position.y = -300;
  scene.add(camera);

  // Create the lights
  var ambientLight = new THREE.AmbientLight(0x999999, 0.5);
  scene.add(ambientLight);
  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 0.5);
  lights[0].position.set(1, 0, 0);
  //top light
  lights[1] = new THREE.DirectionalLight( 0x333333, 1);
  lights[1].position.set(0.75, 1, 0.5);
  //bottom light
  lights[2] = new THREE.DirectionalLight( 0x000000, 1);
  lights[2].position.set(-0.75, -1, 0.5);
  //add lights to scene
  scene.add(lights[0]);
  scene.add( lights[1] );
  scene.add( lights[2] );

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  document.getElementById('canvas').appendChild(renderer.domElement);

  //DAT GUI
    var params = {
        color: 0xffffff
    };

    var params2 = {
      color: 0x4989d2
    }

    var gui = new dat.GUI();

    var planet = gui.addFolder( "Planet" );
    planet.addColor( params, 'color' )
          .onChange( function() { octoMesh.material.color.set( params.color ); } );
    planet.open();

    var stars = gui.addFolder( "Stars" );
    stars.addColor( params2, 'color' )
          .onChange( function() { mesh.material.color.set( params2.color ); } );
    stars.open();

//orbit controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);


octoMain = new THREE.Object3D();
var geometryOcto = new THREE.IcosahedronGeometry(5, 2);
scene.add(octoMain);


//Create the materials
var octoMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shading: THREE.FlatShading
});

//Add materials to the mesh - octoMesh
var octoMesh = new THREE.Mesh(geometryOcto, octoMaterial);
octoMesh.scale.x = octoMesh.scale.y = octoMesh.scale.z = 16;
octoMain.add(octoMesh);


particle = new THREE.Object3D();
scene.add(particle);
var particleGeo = new THREE.TetrahedronGeometry(1, 1);
var particleMat = new THREE.MeshPhongMaterial({
  color: 0x4989d2,
  shading: THREE.FlatShading
});

for (var i = 0; i < 1500; i++) {
  var mesh = new THREE.Mesh(particleGeo, particleMat);
  mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
  mesh.position.multiplyScalar(500);
  mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
  particle.add(mesh);
}






//Create a two dimensional grid of objects, and position them accordingly
for (var x = -200; x <= 200; x += 5) {
    // var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    var boxGeometry = new THREE.SphereGeometry( 0.7, 32, 32 );
    //The color of the material is assigned a random color
    var boxMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xFFFFFF});
    var box = new THREE.Mesh(boxGeometry, boxMaterial);
    //box.castShadow = true;
    box.position.x = x;
    box.position.z = Math.random() - 0.5;
    box.position.y = Math.random() - 0.5;
    //pin
    // box.scale.x = dataArray[x + 524] / 20;

    //cube
    box.scale.y = dataArray[x + 524] / 20;

    scene.add(box);
    cubes.push(box);
}

animate();
//end of init
}




// Render Loop
function animate(){
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  cubes.forEach(function(cube, i) {
    var v = (i + 3000 + dataArray[i] * 0.5) * 0.05;
    cube.position.y += ((cos(i * 100) * v) - cube.position.y) * 0.15;
    cube.position.x += ((sin(i * 100) * v) - cube.position.x) * 0.15;
    cube.rotation.y = 2;
    cube.rotation.x = 1.5;

//pin
    cube.scale.x = dataArray[i] / 10;
    cube.scale.y = dataArray[i] / 10;
//cubes
    // cube.scale.y = dataArray[i] / 10;
    // cube.scale.z = dataArray[i] / 10;
  })

  particle.rotation.x += 0.00035;
  particle.rotation.y -= 0.00035;

  // planet animation
  octoMain.rotation.x += 0.0003;
  octoMain.rotation.y += 0.0003;



  // Render the scene
  renderer.clear();
  renderer.render(scene, camera);
}


//Keep everything appearing properly on screen when window resizes
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); //maintain aspect ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
}
