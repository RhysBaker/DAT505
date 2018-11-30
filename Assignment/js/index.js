//Global variables
var renderer, scene, camera, octoMain, particle;
var partNum = 1000;
var spread;
const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx, audioElement, source, analyser, bufferLength, dataArray, frequencyData;
var particlesStored = [];
var currentSpread = 150;


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
  geometry();
  animate();
  particles();
//end of init
}


// Render Loop
function animate(){
  requestAnimationFrame(animate);
  spread = dataArray[1] / 0.8;
  console.log(spread);
  analyser.getByteFrequencyData(dataArray);
  octoMain.rotation.x += 0.001;
  octoMain.rotation.y -= 0.001;



  particlesStored.forEach(function(part) {
    part.position.multiplyScalar(spread + (Math.random() * 250));
  })

  // particle.rotation.x += 0.0005;
  // particle.rotation.y -= 0.0005;

  // Render the scene
  renderer.clear();
  renderer.render(scene, camera);
}

function particles() {
  for (var i = 0; i < partNum; i++) {

    particle = new THREE.TetrahedronGeometry(0.8, 1);
    particleMat = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading });
    particle  = new THREE.Mesh(particle, particleMat);

     particle.position.x = Math.random() - 0.5;
     console.log(particle.position.x)
     particle.position.z = Math.random() - 0.5;
     particle.position.y = Math.random() - 0.5;
     particle.position.multiplyScalar(spread + (Math.random() * 250));

      scene.add(particle);
      particlesStored.push(particle);

  }
}

//Keep everything appearing properly on screen when window resizes
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); //maintain aspect ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function geometry(){
  //Create the geometric objects
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
}
