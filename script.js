if (jQuery('#myShader').length > 0) {
  var $ = document.querySelector.bind(document);
  container = document.getElementById('myShader');
  var loader = new THREE.TextureLoader();
  var image = new Image();
  image.src = $('#texture').text;
  var texture = loader.load(image.src);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  var camera = new THREE.Camera();
  camera.position.z = 1;

  var sceneA = new THREE.Scene();
  var sceneB = new THREE.Scene();

  var geometry = new THREE.BufferGeometry();
  var vertices = new Float32Array([
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,

    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0
  ]);

  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

  var uniforms = {
    iGlobalTime: { type: "f", value: 1.0 },
    iResolution: { type: "v3", value: new THREE.Vector3() },
    iChannel0: { type: 't', value: texture }
  };

  rtTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,
    { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat }
  );

  var materialA = new THREE.RawShaderMaterial({
    uniforms: uniforms,
    vertexShader: $('#vs').text,
    fragmentShader: $('#fs-a').text,
  });
  /*var materialB = new THREE.ShaderMaterial( {
           uniforms: { bufferTexture: { value: rtTexture } },
           vertexShader: $('#vs').text,
           fragmentShader: $('#fs-b').text,
           depthWrite: false

           } );*/

  var mesh = new THREE.Mesh(geometry, materialA);
  sceneA.add(mesh);

  var renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  resize(true);
  render(0);

  function resize(force) {
    var canvas = renderer.domElement;
    var width = window.innerWidth * window.devicePixelRatio;
    var height = window.innerHeight * window.devicePixelRatio;
    if (force || width != canvas.width || height != canvas.height) {
      console.log('width: ' + width + ', canvas.width: ' + canvas.width);
      console.log('height: ' + height + ', canvas.height: ' + canvas.height);
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.x = renderer.domElement.width;
      uniforms.iResolution.value.y = renderer.domElement.height;
    }

  }

  function render(time) {
    resize();
    uniforms.iGlobalTime.value = time * 0.001;
    //renderer.render(sceneA, camera, rtTexture, true );
    renderer.render(sceneA, camera);
    requestAnimationFrame(render);
  }
}