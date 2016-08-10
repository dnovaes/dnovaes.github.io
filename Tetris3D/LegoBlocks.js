
var stats, camera, scene, renderer;
var startPos =           null;
var blockMoving_f =         0;
var selectedObj =   [2, null];
//scene.children[0] = orthographicCamera. PS for nextObjs.
var currIndex =             2;
var nextObj =               2;
var keyMap =               [];
var totalDiffObj =          4;
//camera and the tetrisWall
var numUnconsideredObjs =   2;
var depthLimit =           10;
//z rotate camera to left with the right (inverse directionsfor camera always)

function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	renderer.setSize(500, 500);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

  aspectRatio = window.innerWidth/window.innerHeight;

	//camera = new THREE.OrthographicCamera( -10.0, 10.0, 10.0, -10.0, -10.0, 10.0 );
  //PerpectiveCamera(fov, aspect, near, far)
	camera = new THREE.PerspectiveCamera( 60, 1.09, 0.01, 1000.0 );

  camera.position.x = 2.5;
  camera.position.y = 2.5;
  camera.position.z = 14;
  camera.updateProjectionMatrix();
	scene.add( camera );

	stats = new Stats();
	document.getElementById('WebGL-output').appendChild(stats.domElement);

  /*var Axis = new THREE.AxisHelper(0.8);
  scene.add(Axis);*/

  var tetrisWall = new THREE.Object3D();
  tetrisWall.name = "tetrisWall";

  //Create Vertical Wall (to the left)
  createWall(tetrisWall, "y", [0.0, 0.0, 0.0]);

  //Create Vertical Wall (to the right)
  createWall(tetrisWall, "y", [5.0, 0.0, 0.0]);

  //Create Horizontal Wall
  createWall(tetrisWall, "x", [0.0, 0.0, 0.0]);

  //Create Horizontal Wall
  createWall(tetrisWall, "x", [0.0, 5.0, 0.0]);

  //Create FloorLimit Wall
  createWall(tetrisWall, "z", [0.0, 0.0, 0.0]);

  scene.add(tetrisWall);

  //Set the start of position for theblocks
  // the 0.5 is the adjust for the theblock stay at the center of cube
  startPos = {"x": 2+0.5, "y": 2+0.5, "z": 9+0.5 }

  //triMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
  //Triangle = new THREE.Mesh(triGeometry, triMaterial);
  //scene.add(Triangle);


  /*geometry = new THREE.CubeGeometry(10, 10, 10);
  material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.name = "myObj";
  scene.add(mesh);*/

  initGUI();

  activateAnimation();
	//renderer.clear();
	//renderer.render(scene, camera);
};

function initGUI() {

	controls = new function () {
		this.fov 			= camera.fov;
		this.camPosX		= camera.position.x;
		this.camPosY		= camera.position.y;
		this.camPosZ		= camera.position.z;
		}

	var gui = new dat.GUI();

	gui.add(controls, 'fov', -10.0, 100.0).onChange(function (value) {
		camera.fov = controls.fov;
		camera.updateProjectionMatrix();
		});

	var fCamPos = gui.addFolder('CameraPos');
	fCamPos.add( controls, 'camPosX', -40.0, 40.0).onChange(function (value) {
		camera.position.x = controls.camPosX;
		camera.updateProjectionMatrix();
		});
	fCamPos.add( controls, 'camPosY', -40.0, 40.0).onChange(function (value) {
		camera.position.y = controls.camPosY;
		camera.updateProjectionMatrix();
		});
	fCamPos.add( controls, 'camPosZ', -40.0, 40.0).onChange(function (value) {
		camera.position.z = controls.camPosZ;
		camera.updateProjectionMatrix();
		});
	fCamPos.close();
};

function doMoveCameraToPos(posVector3){
	camera.position.x =  posVector3.x;
	camera.position.y =  posVector3.y;
	camera.position.z =  posVector3.z;
}

function activateAnimation(){
	requestAnimationFrame(activateAnimation);
	stats.begin();
	renderer.clear();
	render();
	stats.end();
}

function render(){
	//doMoveCameraToPos(cameraFixedtoDraw);

  /*var obj = scene.getObjectByName("myObj");
	obj.rotateX(0.007);
	obj.rotateY(0.003);
	obj.rotateZ(0.001);*/
	renderer.render( scene, camera );
}

function createWall(tetrisWall, chrDirection, arrTransl){

  if(chrDirection == 'y'){
    for (var depth=0; depth<depthLimit; depth++){
      for (var i=0; i<5; i++){

        var triGeometry = new THREE.Geometry();

        triGeometry.vertices.push(
            new THREE.Vector3( 0.0+arrTransl[0], 0.0+i+arrTransl[1], 0.0+depth+arrTransl[2]),
            new THREE.Vector3( 0.0+arrTransl[0], 1.0+i+arrTransl[1], 0.0+depth+arrTransl[2]),
            new THREE.Vector3( 0.0+arrTransl[0], 0.0+i+arrTransl[1], 1.0+depth+arrTransl[2]),
            new THREE.Vector3( 0.0+arrTransl[0], 1.0+i+arrTransl[1], 1.0+depth+arrTransl[2])
        );

        triGeometry.faces.push(
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(1, 2, 3)
        );
        triMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});

        Triangle = new THREE.Mesh(triGeometry, triMaterial);
        tetrisWall.add(Triangle);
      }
    }
  }else if(chrDirection == 'x'){
    for (var depth=0; depth<depthLimit; depth++){
      for (var i=0; i<5; i++){

        var triGeometry = new THREE.Geometry();

        triGeometry.vertices.push(
            new THREE.Vector3( 0.0+i+arrTransl[0], 0.0+arrTransl[1], 0.0+depth+arrTransl[2]),
            new THREE.Vector3( 1.0+i+arrTransl[0], 0.0+arrTransl[1], 0.0+depth+arrTransl[2]),
            new THREE.Vector3( 0.0+i+arrTransl[0], 0.0+arrTransl[1], 1.0+depth+arrTransl[2]),
            new THREE.Vector3( 1.0+i+arrTransl[0], 0.0+arrTransl[1], 1.0+depth+arrTransl[2])
        );

        triGeometry.faces.push(
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(1, 2, 3)
        );
        triMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});

        Triangle = new THREE.Mesh(triGeometry, triMaterial);
        tetrisWall.add(Triangle);

      }
    }
  }else if(chrDirection == 'z'){
    for (var line=0; line<5; line++){
      for (var i=0;i<5; i++){
        var triGeometry = new THREE.Geometry();

        triGeometry.vertices.push(
            new THREE.Vector3( 0.0+i+arrTransl[0], 0.0+line+arrTransl[1], 0.0+arrTransl[2]),
            new THREE.Vector3( 1.0+i+arrTransl[0], 0.0+line+arrTransl[1], 0.0+arrTransl[2]),
            new THREE.Vector3( 0.0+i+arrTransl[0], 1.0+line+arrTransl[1], 0.0+arrTransl[2]),
            new THREE.Vector3( 1.0+i+arrTransl[0], 1.0+line+arrTransl[1], 0.0+arrTransl[2])
        );

        triGeometry.faces.push(
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(1, 2, 3)
        );
        triMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true}); 

        Triangle = new THREE.Mesh(triGeometry, triMaterial);
        tetrisWall.add(Triangle);
      }
    }
  }
}

function LegoBlock0(){

	this.createVertices = function(){
		var triangleGeometry = new THREE.Geometry();

		//ArrArg = [front, back, top, bottom, left, right]
		addBlockGeometrysNextto(triangleGeometry, {x: 0.0, y: 0.0, z: 0.0}, [0, 1, 1, 1, 1, 0]);
		addBlockGeometrysNextto(triangleGeometry, {x: 0.2, y: 0.0, z: 0.0}, [1, 1, 1, 1, 0, 0]);
		addBlockGeometrysNextto(triangleGeometry, {x: 0.4, y: 0.0, z: 0.0}, [1, 1, 1, 1, 0, 1]);
		addBlockGeometrysNextto(triangleGeometry, {x: 0.0, y: 0.0, z: 0.2}, [1, 0, 1, 1, 1, 1]);

		var boxMaterials = [];
		boxMaterials.push(
			new THREE.MeshBasicMaterial({color:0xFF0000, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0x5BDF14, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0x0000FF, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xF0C58D, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xE86B9C, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xFFFFFF, side:THREE.DoubleSide})
		);
		var triangleMaterial = new THREE.MeshFaceMaterial(boxMaterials); 

		return new THREE.Mesh(triangleGeometry, triangleMaterial);
	}

	this.Mesh = this.createVertices();
	this.Vertices = this.Mesh.geometry.vertices;

	/*Meshblock2 = this.Mesh.clone();
	Meshblock2.translateX(1);
	scene.add(Meshblock2);

	Meshblock3 = Meshblock2.clone();
	Meshblock3.translateX(1);
	scene.add(Meshblock3);
	Meshblock3.geometry.verticesNeedUpdate = true;
	console.log(Meshblock3.geometry.vertices);

	Meshblock4 = this.Mesh.clone();
	Meshblock4.translateZ(1);
	scene.add(Meshblock4);*/

}

function LegoBlock1(){

	this.createVertices = function(){
		var triangleGeometry = new THREE.Geometry();

		//ArrArg = [front, back, top, bottom, left, right]
		addBlockGeometrysNextto(triangleGeometry, {x: 0.0, y: 0.0, z: 0.0}, [0, 1, 1, 1, 0, 0]);
		addBlockGeometrysNextto(triangleGeometry, {x: -0.2, y: 0.0, z: 0.0}, [1, 1, 1, 1, 1, 0]);
		addBlockGeometrysNextto(triangleGeometry, {x: 0.2, y: 0.0, z: 0.0}, [1, 1, 1, 1, 0, 1]);
		addBlockGeometrysNextto(triangleGeometry, {x: 0.0, y: 0.0, z: 0.2}, [1, 0, 1, 1, 1, 1]);

		var boxMaterials = [];
		boxMaterials.push(
			new THREE.MeshBasicMaterial({color:0xFF0000, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0x5BDF14, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0x0000FF, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xF0C58D, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xE86B9C, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xFFFFFF, side:THREE.DoubleSide})
		);
		var triangleMaterial = new THREE.MeshFaceMaterial(boxMaterials); 

		return new THREE.Mesh(triangleGeometry, triangleMaterial);
	}

	this.Mesh = this.createVertices();
}

function LegoBlock2(){

	this.createVertices = function(){
		var triangleGeometry = new THREE.Geometry();

		//ArrArg = [front, back, top, bottom, left, right]
		addBlockGeometrysNextto(triangleGeometry, {x: 0.0, y: 0.0, z: 0.0}, [1, 0, 1, 1, 0, 1]);
		addBlockGeometrysNextto(triangleGeometry, {x: -0.2, y: 0.0, z: 0.0}, [1, 1, 1, 1, 1, 0]);
		addBlockGeometrysNextto(triangleGeometry, {x: 0.0, y: 0.0, z: -0.2}, [0, 1, 1, 1, 1, 1]);

		var boxMaterials = [];
		boxMaterials.push(
			new THREE.MeshBasicMaterial({color:0xFF0000, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0x5BDF14, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0x0000FF, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xF0C58D, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xE86B9C, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xFFFFFF, side:THREE.DoubleSide})
		);
		var triangleMaterial = new THREE.MeshFaceMaterial(boxMaterials); 

		return new THREE.Mesh(triangleGeometry, triangleMaterial);
	}

	this.Mesh = this.createVertices();
}

function LegoBlock3(){

	this.createVertices = function(){
		var triangleGeometry = new THREE.Geometry();

		//ArrArg = [front, back, top, bottom, left, right]
		addBlockGeometrysNextto(triangleGeometry, {x: 0.0, y: 0.0, z: 0.0}, [1, 0, 1, 1, 1, 0]);
		addBlockGeometrysNextto(triangleGeometry, {x: 0.2, y: 0.0, z: 0.0}, [1, 1, 1, 1, 0, 1]);
		addBlockGeometrysNextto(triangleGeometry, {x: 0.0, y: 0.0, z:-0.2}, [0, 1, 1, 1, 0, 1]);
		addBlockGeometrysNextto(triangleGeometry, {x: -0.2, y: 0.0, z:-0.2}, [1, 1, 1, 1, 1, 1]);

		var boxMaterials = [];
		boxMaterials.push(
			new THREE.MeshBasicMaterial({color:0xFF0000, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0x5BDF14, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0x0000FF, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xF0C58D, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xE86B9C, side:THREE.DoubleSide}), 
			new THREE.MeshBasicMaterial({color:0xFFFFFF, side:THREE.DoubleSide})
		);
		var triangleMaterial = new THREE.MeshFaceMaterial(boxMaterials); 

		return new THREE.Mesh(triangleGeometry, triangleMaterial);
	}

	this.Mesh = this.createVertices();
}

function addBlockGeometrysNextto(triangleGeometry, TransCoordObj, ArrArg){
	//TransCoordObj = an object with values of translate in x, y and z.
	//TransCoordObj = {x: value, y: value, z: value}
	//
	//ArrArg: 0 -> false, 1 -> true
	//[0] = FRONT, [1] = BACK, [2] = TOP, [3] = BOTTOM, [4] = LEFT, [5] = RIGHT

	var currentTriangleLenght = triangleGeometry.vertices.length;
	var len = currentTriangleLenght;

	var f_addFaces = false;

	//console.log(typeof(TransCoordObj));
	if(typeof(TransCoordObj) == "object"){
		triangleGeometry.vertices.push(new THREE.Vector3( 0.1+TransCoordObj.x,  0.1+TransCoordObj.y,  0.1+TransCoordObj.z));
		triangleGeometry.vertices.push(new THREE.Vector3( 0.1+TransCoordObj.x, -0.1+TransCoordObj.y,  0.1+TransCoordObj.z));
		triangleGeometry.vertices.push(new THREE.Vector3(-0.1+TransCoordObj.x, -0.1+TransCoordObj.y,  0.1+TransCoordObj.z));
		triangleGeometry.vertices.push(new THREE.Vector3(-0.1+TransCoordObj.x,  0.1+TransCoordObj.y,  0.1+TransCoordObj.z));

		triangleGeometry.vertices.push(new THREE.Vector3(-0.1+TransCoordObj.x,  0.1+TransCoordObj.y, -0.1+TransCoordObj.z));
		triangleGeometry.vertices.push(new THREE.Vector3( 0.1+TransCoordObj.x,  0.1+TransCoordObj.y, -0.1+TransCoordObj.z));
		triangleGeometry.vertices.push(new THREE.Vector3( 0.1+TransCoordObj.x, -0.1+TransCoordObj.y, -0.1+TransCoordObj.z));
		triangleGeometry.vertices.push(new THREE.Vector3(-0.1+TransCoordObj.x, -0.1+TransCoordObj.y, -0.1+TransCoordObj.z));
		f_addFaces = true;
	}

	numFaces = triangleGeometry.faces.length;
	//numRandom = Math.ceil(Math.random()*5);

	if((ArrArg.length > 0)&&(f_addFaces)){
		if(ArrArg[0] == 1){
			// Front
			triangleGeometry.faces.push(new THREE.Face3(0+len, 1+len, 2+len));
			triangleGeometry.faces.push(new THREE.Face3(0+len, 2+len, 3+len));
			triangleGeometry.faces[triangleGeometry.faces.length-2].materialIndex =
			triangleGeometry.faces[triangleGeometry.faces.length-1].materialIndex = 0;
		}

		if(ArrArg[1] == 1){
			// Back
			triangleGeometry.faces.push(new THREE.Face3(5+len, 6+len, 7+len));
			triangleGeometry.faces.push(new THREE.Face3(5+len, 7+len, 4+len));
			triangleGeometry.faces[triangleGeometry.faces.length-2].materialIndex =
			triangleGeometry.faces[triangleGeometry.faces.length-1].materialIndex = 1;
		}

		if(ArrArg[2] == 1){
			// Top
			triangleGeometry.faces.push(new THREE.Face3(5+len, 0+len, 3+len)); 
			triangleGeometry.faces.push(new THREE.Face3(5+len, 3+len, 4+len)); 
			triangleGeometry.faces[triangleGeometry.faces.length-2].materialIndex = 
			triangleGeometry.faces[triangleGeometry.faces.length-1].materialIndex = 2;
		}

		if(ArrArg[3] == 1){
			// Bottom
			triangleGeometry.faces.push(new THREE.Face3(6+len, 1+len, 2+len)); 
			triangleGeometry.faces.push(new THREE.Face3(6+len, 2+len, 7+len)); 
			triangleGeometry.faces[triangleGeometry.faces.length-2].materialIndex = 
			triangleGeometry.faces[triangleGeometry.faces.length-1].materialIndex = 3;
		}

		if(ArrArg[4] == 1){
			// Left
			triangleGeometry.faces.push(new THREE.Face3(3+len, 2+len, 7+len)); 
			triangleGeometry.faces.push(new THREE.Face3(3+len, 7+len, 4+len)); 
			triangleGeometry.faces[triangleGeometry.faces.length-2].materialIndex = 
			triangleGeometry.faces[triangleGeometry.faces.length-1].materialIndex = 4;
		}

		if(ArrArg[5] == 1){
			// Right
			triangleGeometry.faces.push(new THREE.Face3(5+len, 6+len, 1+len)); 
			triangleGeometry.faces.push(new THREE.Face3(5+len, 1+len, 0+len));
			triangleGeometry.faces[triangleGeometry.faces.length-2].materialIndex = 
			triangleGeometry.faces[triangleGeometry.faces.length-1].materialIndex = 5;
		}
	}
}

function checkObjinCenter(){
  if(scene.children.length > numUnconsideredObjs){
    //each child of scene is a object3d (group)
    for(i=2; i<scene.children.length; i++){
      //console.log(scene.children[i].position);
      if((scene.children[i].position.x == startPos.x)
        &&(scene.children[i].position.y == startPos.y)
        &&(scene.children[i].position.z == (startPos.z-1))
      ){
        return 1;
      }
    }
  }
  return 0;
}

function spawnObjinCenter(){

  //Add a random block number
  var num = Math.floor(Math.random()*(totalDiffObj-1));
  addObjinScene(num);

  console.log("Added object.\n");

  updateNextObj();
}

function addObjinScene(numBlock){
  switch(numBlock){
    case 0:
      var Obj = new LegoBlock0();
      var group = new THREE.Object3D();
      var axis =  new THREE.AxisHelper(0.45);
      axis.visible = false;
      group.add(Obj.Mesh);
      group.add(axis);
      scene.add(group);
      break;
    case 1:
      var Obj = new LegoBlock1();
      var group = new THREE.Object3D();
      var axis =  new THREE.AxisHelper(0.45);
      axis.visible = false;
      group.add(Obj.Mesh);
      group.add(axis);
      scene.add(group);
      break;
    case 2:
      var Obj = new LegoBlock2();
      var group = new THREE.Object3D();
      var axis =  new THREE.AxisHelper(0.45);
      axis.visible = false;
      group.add(Obj.Mesh);
      group.add(axis);
      scene.add(group);
      break;
    case 3:
      var Obj = new LegoBlock3();
      var group = new THREE.Object3D();
      var axis =  new THREE.AxisHelper(0.45);
      axis.visible = false;
      group.add(Obj.Mesh);
      group.add(axis);
      scene.add(group);
      break;
  }
  var m = new THREE.Matrix4();
  m.identity();
  m.makeScale(5.0, 5.0, 5.0);
  group.applyMatrix(m);
  group.updateMatrix();

  m.makeTranslation(startPos.x, startPos.y, (startPos.z-1));
  group.applyMatrix(m);
  group.updateMatrix();

  /*m.identity();
  m.makeTranslation(0.3, 0, 0);
  Obj.Mesh.applyMatrix(m);
  Obj.Mesh.updateMatrix();*/
}

function doSelectObjinScene(index){
  console.log("Selecting obj index: "+index);
  //[0] = PerpectiveCamera  // [1] = tetrisWall
  if(scene.children.length > 2){
    changeOpacityByIndexSceneObj(index, 0.4);
    //make axisHelper visible
    //scene.children[index] = group  | scene.children[index].children[1] = axisHelper
    scene.children[index].children[1].visible = true;

    //update the current pos and next pos for the obj
    selectedObj = [index, scene.children[index]];
    currIndex = index;
    updateNextObj();
  }
}

//unselect the selected Obj if there is any.
function unselectObj(){
  if(selectedObj[1] != null){
    changeOpacityByIndexSceneObj(selectedObj[0], 1.0);
    spawnObjinCenter();
    currIndex = scene.children.length-1;
//    selectedObj = [currIndex, null];
    doSelectObjinScene(currIndex);
  }
}

function updateNextObj(){

    var adjustedIndex = (currIndex-2);
    console.log("index without the unconsidered objs "+(adjustedIndex+1) % (scene.children.length-numUnconsideredObjs));

    nextObj = ((adjustedIndex+1) % (scene.children.length-numUnconsideredObjs))+numUnconsideredObjs;
    console.log("NextObj: "+nextObj, "length "+scene.children.length);

}

//changing the opacity of the obj make the use to see if the object is selected or not.
//AND make axisHelper invisible
function changeOpacityByIndexSceneObj(index, val){
  for(var i=0; i<scene.children[index].children[0].material.materials.length; i++){
    scene.children[index].children[0].material.materials[i].opacity = val;
    scene.children[index].children[0].material.materials[i].transparent = true;
  }
  //value = 1.0, then the application is making all the faces visible with no transparency.
  //then its not a selected object anymore. hide the axisHelper with it too.
  if(val == 1){
    scene.children[index].children[1].visible = false;
  }
}

//except for camera. Clear all objects in the scene
function clearObjsinScene(){
	for(var i=1; i<scene.children.length; i++){
		scene.remove(scene.children[i]);
    i--;
	}
}

function getCurrPosfromSelectedObj(){

    return {
      "x": selectedObj[1].position.x,
      "y": selectedObj[1].position.y,
      "z": selectedObj[1].position.z
    }
}

function detectKeyboardAction(){
  if(selectedObj[1] != null){
    m = new THREE.Matrix4();
    m.identity();
    //ctrl
    if(keyMap[17] == null || !keyMap[17]){
      //right
      if(keyMap[39]){
        m.makeTranslation(1.0, 0.0, 0.0);
        selectedObj[1].applyMatrix(m);
        selectedObj[1].updateMatrix();
      }
      //left
      if(keyMap[37]){
        m.makeTranslation(-1.0, 0.0, 0.0);
        selectedObj[1].applyMatrix(m);
        selectedObj[1].updateMatrix();
      }
      //up
      if(keyMap[38]){
        //selectedObj[1].matrix.copy(m);
        m.makeTranslation(0.0, 1.0, 0.0);
        selectedObj[1].applyMatrix(m);
        selectedObj[1].updateMatrix();
      }
      //down
      if(keyMap[40]){
        //save the previous pos
        prevPos = selectedObj[1].position;
        m.makeTranslation(0.0, -1.0, 0.0);
        selectedObj[1].applyMatrix(m);
        selectedObj[1].updateMatrix();
      }
      /*
      //plus (scale up)
      if(keyMap[107]){
        var prevPos = getCurrPosfromSelectedObj();

        m.makeTranslation(-prevPos.x, -prevPos.y, -prevPos.z);
        selectedObj[1].applyMatrix(m);
        selectedObj[1].updateMatrix();

        m.makeScale(1.1, 1.1, 1.1);
        selectedObj[1].applyMatrix(m)
        selectedObj[1].updateMatrix();

        m.makeTranslation(prevPos.x, prevPos.y, prevPos.z);
        selectedObj[1].applyMatrix(m);
        selectedObj[1].updateMatrix();
        console.log(selectedObj[1].scale);
      }
      //minus (scale down)
      if(keyMap[109]){
        var prevPos = getCurrPosfromSelectedObj();

        m.makeTranslation(-prevPos.x, -prevPos.y, -prevPos.z);
        selectedObj[1].applyMatrix(m);
        selectedObj[1].updateMatrix();

        m.makeScale(0.9, 0.9, 0.9);
        selectedObj[1].applyMatrix(m)
        selectedObj[1].updateMatrix();

        m.makeTranslation(prevPos.x, prevPos.y, prevPos.z);
        selectedObj[1].applyMatrix(m);
        selectedObj[1].updateMatrix();
      }
      */
    }

    //Rotation Y (ctrl + left)
    if(keyMap[17] && keyMap[37]){
      //save the amount value for translation back and further
      var prevPos = getCurrPosfromSelectedObj();

      m.makeTranslation(-prevPos.x, -prevPos.y, -prevPos.z);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();

      m.makeRotationY(-Math.PI/2);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();

      m.makeTranslation(prevPos.x, prevPos.y, prevPos.z);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();
    }

    //Rotation Y (ctrl + right)
    if(keyMap[17] && keyMap[39]){
      //this will save the amoount of translation is necessary to put the object back there or further there
      var prevPos = getCurrPosfromSelectedObj();

      m.makeTranslation(-prevPos.x, -prevPos.y, -prevPos.z);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();

      m.makeRotationY(Math.PI/2);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();

      m.makeTranslation(prevPos.x, prevPos.y, prevPos.z);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();
    }

    //Rotation X (ctrl + up)
    if(keyMap[17] && keyMap[38]){
      var prevPos = getCurrPosfromSelectedObj();

      m.makeTranslation(-prevPos.x, -prevPos.y, -prevPos.z);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();

      m.makeRotationX(-Math.PI/2);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();

      m.makeTranslation(prevPos.x, prevPos.y, prevPos.z);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();
    }

    //Rotation X (ctrl + down)
    if(keyMap[17] && keyMap[40]){
      var prevPos = getCurrPosfromSelectedObj();

      m.makeTranslation(-prevPos.x, -prevPos.y, -prevPos.z);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();

      m.makeRotationX(Math.PI/2);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();

      m.makeTranslation(prevPos.x, prevPos.y, prevPos.z);
      selectedObj[1].applyMatrix(m);
      selectedObj[1].updateMatrix();
    }

  }
  //Enter: buttom to start the game
  //spawn a random block at the startPos
  if(keyMap[13]){
    spawnObjinCenter();
    doSelectObjinScene(scene.children.length-1);
  }

}

function moveSelectedObj(){
  if(selectedObj[1] != null){
    selectedObj[1].position.z+=-1;
  }
}

$(document).ready(function(){

    document.body.onkeydown = function(e){
      if(e.keyCode == 9){
        //console.log("check if there is any selected obj ", selectedObj);
        if(selectedObj[1] != null){
          changeOpacityByIndexSceneObj(selectedObj[0], 1.0);
        }
        doSelectObjinScene(nextObj);
      }
   }

  /*setInterval(function(){
    if(!blockMoving_f && !checkObjinCenter()){
      spawnObjinCenter();
    }
  }, 3000);*/

  setInterval(function(){
    detectKeyboardAction();
  }, 1000/10);

  setInterval(function(){
    if(selectedObj[1].position.z == 0.5){
      unselectObj();
    }
    moveSelectedObj(0, 0, -1);
  }, 1500/1);


  /*$("#game-mode").on("click", function(){
    visualMode = 1-visualMode;
    editMode = 1-editMode;
    clearObjsinScene();
    selectedObj = [0, null];
    if(visualMode){
      $("#log-text").text("Visual Mode");
    }else{
      $("#log-text").text("Edit Mode");
    }
  });*/

  $(document).on("keydown keyup", function(e){
    keyMap[e.keyCode] = (e.type == "keydown");
    console.log(e.keyCode);
    if(e.keyCode != 116 && e.keyCode != 123){
      e.preventDefault();
    }
  });
});