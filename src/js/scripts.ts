import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

import nebula from "../img/nebula.jpg";
import stars from "../img/stars.jpg";

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// camera.position.z = 5;
// camera.position.y = 2;
camera.position.set(-10, 30, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
// const planeMaterial = new THREE.MeshBasicMaterial({
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
// const sphereMaterial = new THREE.MeshBasicMaterial({
// const sphereMaterial = new THREE.MeshLambertMaterial({
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff, 50000);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xfffffff, 0, 200);
// scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// renderer.setClearColor(0xffea00);

const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  nebula,
  nebula,
  stars,
  stars,
  stars,
  stars,
]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  // map: textureLoader.load(nebula),
});
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
];
// const box2 = new THREE.Mesh(box2Geometry, box2Material);
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10);

const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 100000,
};
gui.addColor(options, "sphereColor").onChange((e) => {
  sphere.material.color.set(e);
});
gui.add(options, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
});
gui.add(options, "speed", 0, 0.1);
gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 100000);

let step = 0;

// box.rotation.x = 5;
// box.rotation.y = 5;

function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

renderer.render(scene, camera);
