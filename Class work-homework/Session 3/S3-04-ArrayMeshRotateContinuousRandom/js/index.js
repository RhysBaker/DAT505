var renderer, scene, camera;
var cubes = []; //cubes[] needs to be globally declared so that we can access them from any function

//Create two arrays to store random values for speed rotation
var randomRotationX = [];
var randomRotationY = [];

function init() {
  scene = new THREE.Scene();

  var W = window.innerWidth,
      H = window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, W / H, .1, 1000);
  camera.position.set(0, 80, 0);
  camera.lookAt(scene.position);

  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(0, 1000, 0);
  scene.add(spotLight);
  //spotLight.castShadow = true;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0x17293a);
  renderer.setSize(W, H);
  //renderer.shadowMapEnabled = true;

  //Create a two dimensional grid of objects, and position them accordingly
  for (var x = -45; x <= 45; x += 5) { // Start from -45 and sequentially add one every 5 pixels
    for (var y = -30; y <= 30; y += 5) {
      var boxGeometry = new THREE.BoxGeometry(3, 6, 3);
      //The color of the material is assigned a random color
      var boxMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xFFFFFF});
      var box = new THREE.Mesh(boxGeometry, boxMaterial);

      //box.castShadow = true;

      box.position.x = x;
      box.position.z = y;
      box.scale.y = 0.5;

      box.rotation.x = Math.random() * 2 * Math.PI;;
      box.rotation.y = Math.random() * 2 * Math.PI;;
      box.rotation.z = Math.random() * 2 * Math.PI;;

      //Create random values for x and y, and store them on the arrays
      var randomValueX = (Math.random() * 0.1) - 0.05;
      var randomValueY = (Math.random() * 0.1) - 0.05;
      randomRotationX.push(randomValueX);
      randomRotationY.push(randomValueY);

      scene.add(box);
      cubes.push(box);
    }
  }
  //console.log(randomRotation);
  document.body.appendChild(renderer.domElement);
}

function drawFrame(){
  requestAnimationFrame(drawFrame);

  //Rotation speed is extracted from the arrays we created
  //i is keeping track of the index for each cube
  cubes.forEach(function(c, i) {
    c.rotation.x += randomRotationX[i];
    c.rotation.y += randomRotationY[i];
  });

  renderer.render(scene, camera);
}

init();
drawFrame();
