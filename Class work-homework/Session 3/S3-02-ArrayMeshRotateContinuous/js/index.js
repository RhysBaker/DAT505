var renderer, scene, camera;
var cubes = []; //cubes[] needs to be globally declared so that we can access them from any function

function init() {
  scene = new THREE.Scene();

  var W = window.innerWidth,
      H = window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, W / H, .1, 1000);
  camera.position.set(0, 55, 85);
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

      //box.rotation.x = Math.random() * 2 * Math.PI;;
      //box.rotation.y = Math.random() * 2 * Math.PI;;
      //box.rotation.z = Math.random() * 2 * Math.PI;;

      scene.add(box);
      cubes.push(box); //When we have our box object ready, add it to the array using push()
    }
  }

  document.body.appendChild(renderer.domElement);
}

var rot = 0;

function drawFrame(){
  requestAnimationFrame(drawFrame);
  rot += 0.01;

  //forEach takes all the array entries and passes the c as the object, and i as the index
  cubes.forEach(function(c, i) {
      c.rotation.x = rot; //Rotate the object that is referenced in c 
  });

  renderer.render(scene, camera);
}

init();
drawFrame();
