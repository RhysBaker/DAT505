//Global variables
var scene, camera, renderer;
var geometry, material, mesh;
var geometry1, material1, mesh1;
var geometry2, material2, mesh2;

function init(){
  // Create an empty scene --------------------------
  scene = new THREE.Scene();

  // Create a basic perspective camera --------------
  camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 300, 10000 );

  // Create a renderer with Antialiasing ------------
  renderer = new THREE.WebGLRenderer({antialias:true});

  // Configure renderer clear color
  renderer.setClearColor("#000000");

  // Configure renderer size
  renderer.setSize( window.innerWidth, window.innerHeight );

  // Append Renderer to DOM
  document.body.appendChild( renderer.domElement );
}

function geometry(){
  // Configure lights -------------------------------
  var light1 = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light1);

  var light2 = new THREE.PointLight(0xffffff, 0.5);
  scene.add(light2);
  // Create a Cube Mesh with basic material ---------
  geometry = new THREE.ConeGeometry( 100, 100, 100 );
  material = new THREE.MeshPhongMaterial( { color: "#433F81" } );
  mesh = new THREE.Mesh( geometry, material );

  geometry1 = new THREE.BoxGeometry(100, 100, 100);
  mesh1 = new THREE.Mesh( geometry1, material );
  mesh2 = new THREE.Mesh( geometry1, material );


  mesh.position.z = -1000;
  mesh1.position.z = -1000;
  mesh1.position.x = 300;
  mesh2.position.z = -1000;
  mesh2.position.x = -300;


  // Add mesh to scene
  scene.add( mesh );
  scene.add( mesh1 );
  scene.add( mesh2 );
}

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  mesh.rotation.x += 0.01; //Continuously rotate the mesh
  mesh.rotation.y += 0.01;
  mesh1.rotation.x += 0.01; //Continuously rotate the mesh
  mesh1.rotation.y += 0.01;
  mesh2.rotation.x += 0.01; //Continuously rotate the mesh
  mesh2.rotation.y += 0.01;
  renderer.setClearColor("#000000");

  // Render the scene
  renderer.render(scene, camera);
};

init();
geometry();
render();
