// Panorama Object
var Pan = {
	
	startTime : Date.now(),
	container : null,
	camera : null,
	scene : null,
	renderer : null,
	skyboxMesh : null,			
	timer : null,
	
	init : function(){
	

	

		// test if webgl is supported
		//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

		// init container
		Pan.viewport = document.querySelector("#panorama");
		var viewportWidth = $("#panorama").width(), viewportHeight = $("#panorama").height();
		
		
		// create the camera
		Pan.camera = new THREE.Camera( 45, viewportWidth / viewportHeight, 1, 100000 );

		// create the Scene
		Pan.scene = new THREE.Scene();
		
		// ## Begining of the Skybox Code
		
		// load the cube textures
		var urlPrefix	= "images/skybox/";
		var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
				urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
				urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];
		var textureCube	= THREE.ImageUtils.loadTextureCube( urls );
		
		// init the cube shadder
		var shader	= THREE.ShaderUtils.lib["cube"];
		var uniforms	= THREE.UniformsUtils.clone( shader.uniforms );
		uniforms['tCube'].texture= textureCube;
		var material = new THREE.MeshShaderMaterial({
			fragmentShader	: shader.fragmentShader,
			vertexShader	: shader.vertexShader,
			uniforms	: uniforms
		});

		// build the skybox Mesh
		Pan.skyboxMesh	= new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1, null, true ), material );
		// add it to the scene
		Pan.scene.addObject(Pan.skyboxMesh);

		// ## End of the Skybox Code

		// init the WebGL renderer and append it to the Dom
		Pan.renderer = new THREE.WebGLRenderer();
		
		Pan.renderer.setSize(window.innerWidth, window.innerHeight );
		
		Pan.viewport.appendChild(Pan.renderer.domElement);

		document.addEventListener('keydown',function(e){

			switch(e.keyCode){
				case 37: // left arrow
					/* camera.position.x = (1000 * Math.sin(timer)); */
					/* camera.position.x = -(1000 * Math.sin(Pan.timer)); */
					Pan.timer -= new Date().getTime() * 0.0001;
					break;
				case 38 : // Up arrow	
					//camera.position.y = (1000 * Math.cos(Pan.timer));
					break;
				case 39 : // Right arrow
					Pan.timer = - (new Date().getTime() * 0.0001);
					break;
				case 40 : // Down arrow
					//camera.position.y = -(1000 * Math.cos(-Pan.timer));
				break;	
					
			}
			e.preventDefault();
			Pan.render();
		},false);

	},
	animate : function(){

		Pan.render();
		requestAnimationFrame(Pan.animate);
	
	},
	render : function(){
		// move the camera based on a timer (best speed : 0.0002)
		//Pan.timer = new Date().getTime() * 0.0001; // Variación del ángulo, a mayor decimales más lento es el mov.
		
		
		Pan.camera.position.x = (1000 * Math.sin(Pan.timer)); // el primer factor da el radio
		Pan.camera.position.z = (1000 * Math.cos(Pan.timer)); // Si lo factores de x e y difieren se forma una elipse
		// actually display the scene in the Dom element
		Pan.renderer.render( Pan.scene, Pan.camera );
	
	}
};

	// http://learningthreejs.com/blog/2011/08/15/lets-do-a-sky/
	// This source is the javascript needed to build a sky box in **three.js**
	// It is the source about this [blog post](/blog/2011/08/15/lets-do-a-sky/)
	
$(document).ready(function(){
	Pan.init();
	//Pan.animate();
	
	
});	