//Global variables
var renderer, scene, camera, octoMain, particle;
var partNum;
var spread;
const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx, audioElement, source, analyser, bufferLength, dataArray, frequencyData;
var particlesStored = [];



//Execute the main functions when the page loads


var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );


function init(){
  // overlay for new chrome autoplay t&s
  var overlay = document.getElementById( 'overlay' );
  overlay.remove();

//Audio handling
  audioCtx = new AudioContext();
  audio = document.querySelector('audio');
  audio.play();
  audio.volume = .1;
  source = audioCtx.createMediaElementSource(audio)
  analyser = audioCtx.createAnalyser();

  source.connect(analyser);
  source.connect(audioCtx.destination);

  analyser.fftSize = 256;
  bufferLength = analyser.frequencyBinCount;
  console.log({ bufferLength })

  dataArray = new Uint8Array(bufferLength);


  //renderer settings
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  document.getElementById('canvas').appendChild(renderer.domElement);
  //----------------------------------------------------------------------------




  // Create an empty scene
  scene = new THREE.Scene();

  // Create a basic perspective camera
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );
  camera.position.z = 450;
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

//orbit controls
  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

//call functions
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

  animate();




  console.log(multiscale)

  var params = {
      color: 0xff00ff
  };

  var gui = new dat.GUI();

  var planet = gui.addFolder( "Planet" );
  planet.addColor( params, 'color' )
        .onChange( function() { octoMesh.material.color.set( params.color ); } );
  planet.open();

  var stars = gui.addFolder( "Stars" );
  stars.addColor( params, 'color' )
        .onChange( function() { particle.material.color.set( params.color ); } );
  stars.open();



  var starsFunc = function() {
    this.partNum = 1000;
    // Define render logic ...
  };

  var text = new starsFunc();
  stars.add(text, 'partNum', 500, 2500);

//
//   var particleGUI = gui.addFolder('Cube');
// particleGUI.add(octoMesh.scale, 'x', 0, 15).name('star count').listen();
// particleGUI.open();
//end of init
}


// Render Loop
function animate(){
  requestAnimationFrame(animate);
  //value that being used to determain the multiplyScalar
  spread = dataArray[1] / .66;
  // console.log(spread);
  //audio
  analyser.getByteFrequencyData(dataArray);


//dont make it change position maybe make the song change how quickly stars come in
var partNum = 1;

if (partNum < 1500) {
  // planet animation
  octoMain.rotation.x += 0.001;
  octoMain.rotation.y -= 0.001;
  for (var i = 0; i < partNum; i++) {
    particle = new THREE.TetrahedronGeometry(0.8, 1);
    particleMat = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading });
    particle  = new THREE.Mesh(particle, particleMat);
     particle.position.x = Math.random() - 0.5;
     particle.position.z = Math.random() - 0.5;
     particle.position.y = Math.random() - 0.5;
     var multiscale = particle.position.multiplyScalar(600);
      scene.add(particle);
      particlesStored.push(particle);
      renderer.clear();
  }
  console.log(partNum);
}

  particlesStored.forEach(function(element, index) {
    // console.log(elemeent, index)
    if (spread > 0) {
      // console.log(element.position, spread)
      element.position.x += ((element.position.x + spread) - element.position.x * 2) * 0.15;

      // element.position.y -= ((element.position.y + spread) - element.position.y) * 0.15;
      // element.position.x += ((element.position.x + spread) - element.position.x * 2) * 0.15

      // element.scale.z += spread
      // element.rotation.x += spread
      // element.rotation.y =+ spread

    }

  })
  // particle.position.multiplyScalar(spread);


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
