//Global variables
var renderer, scene, camera, octoMain, particles;
var partNum = 1000;
var spread;
const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx, audioElement, source, analyser, bufferLength, dataArray, frequencyData;

//Execute the main functions when the page loads


var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );


function init(){
  var overlay = document.getElementById( 'overlay' );
  overlay.remove();

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

  //Configure renderer settings-------------------------------------------------
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

  var controls = new THREE.OrbitControls(camera, renderer.domElement);




//particle creation and positioning


  window.addEventListener('resize', onWindowResize, false);

  geometry();
  animate();
//end of init
}


// Render Loop
function animate(){

  requestAnimationFrame(animate);

  console.log(spread);

  analyser.getByteFrequencyData(dataArray);
  spread = dataArray[1] / 0.75;


  octoMain.rotation.x += 0.001;
  octoMain.rotation.y -= 0.001;

  particleObj.rotation.x += 0.0005;
  particleObj.rotation.y -= 0.0005;

  // Render the scene
  renderer.clear();
  renderer.render(scene, camera);
  return spread;
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

  particleObj = new THREE.Object3D();
  scene.add(particleObj);
  var particleGeo = new THREE.TetrahedronGeometry(0.8, 1);
  var particleMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  for (var i = 0; i < partNum; i++) {
    var particles = new THREE.Mesh(particleGeo, particleMat);
    particles.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    particles.position.multiplyScalar(120 + (Math.random() * 250));
    particles.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    scene.add(particles);
    particleObj.add(particles);
  }
}
