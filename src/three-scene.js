import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import * as CANNON from 'cannon'
import { CannonPhysics } from 'three/examples/jsm/physics/CannonPhysics.js'

var camera, scene, renderer
var physics, position

export function sceneThree() {
  init()
  animate()
}

function init() {
  physics = new CannonPhysics()
  position = new THREE.Vector3()

  //

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  )
  camera.position.set(-1, 1, 2)
  camera.lookAt(0, 0, 0)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x666666)

  var light = new THREE.HemisphereLight()
  light.intensity = 0.35
  scene.add(light)

  var light = new THREE.DirectionalLight()
  light.position.set(5, 5, 5)
  light.castShadow = true
  light.shadow.camera.zoom = 2
  scene.add(light)

  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5),
    new THREE.ShadowMaterial({ color: 0x111111 }),
  )
  plane.rotation.x = -Math.PI / 2
  plane.receiveShadow = true
  scene.add(plane)
  physics.addMesh(plane)

  var cubone = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.2, 2),
    new THREE.MeshBasicMaterial(),
  )

  scene.add(cubone)
  physics.addMesh(cubone)
  /*
				function getSize() {
					return Math.random() * 0.1 + 0.05;
				}
				*/

  var geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1)
  var material = new THREE.MeshLambertMaterial(/*{ vertexColors: true }*/)
  var mesh = new THREE.InstancedMesh(geometry, material, 200)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)

  var matrix = new THREE.Matrix4()

  for (var i = 0; i < mesh.count; i++) {
    matrix.setPosition(
      Math.random() - 0.5,
      Math.random() * 2,
      Math.random() - 0.5,
    )
    mesh.setMatrixAt(i, matrix)
  }

  /*
				var instanceColors = [];
				for ( var i = 0; i < mesh.count; i ++ ) {
					instanceColors.push( Math.random(), Math.random(), Math.random() );
				}
				mesh.geometry.setAttribute( 'instanceColor', new THREE.InstancedBufferAttribute( new Float32Array( instanceColors ), 3 ) );
				*/

  physics.addMesh(mesh, 1)

  //

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.outputEncoding = THREE.sRGBEncoding
  // document.body.appendChild(renderer.domElement)
  // const container = document.getElementById('container')
  container.appendChild(renderer.domElement)

  //

  new OrbitControls(camera, renderer.domElement)
}

function animate() {
  requestAnimationFrame(animate)

  var mesh = scene.children[4]
  var index = Math.floor(Math.random() * mesh.count)

  position.set(0, Math.random() * 2, 0)
  physics.setMeshPosition(mesh, position, index)

  renderer.render(scene, camera)
}
