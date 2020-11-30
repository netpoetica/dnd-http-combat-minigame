/**
 * @fileoverview Please excuse the raw nature of this file. For the sake of time, I have
 * taken shortcuts in here that would not be appropriate for a production-ready 3D rendering
 * framework. Particularly, much less would be module-scoped, and there would be a more robust
 * animation loading mechanism.
 */
import * as THREE from 'three';
import { ColladaLoader, Collada } from 'three/examples/jsm/loaders/ColladaLoader';

let camera: THREE.Camera | undefined;
let scene: THREE.Scene | undefined;
let renderer: THREE.Renderer | undefined;
const models: {
    jab?: Collada;
} = {};

export let action: THREE.AnimationAction | undefined;
export let actions: {
    jab?: THREE.AnimationAction;
} = {};

const clock = new THREE.Clock();

let mixer: THREE.AnimationMixer | undefined;

export function init() {
    const container = document.createElement('div');

    const elem = document.getElementById('display');
    if (elem) {
        elem.appendChild(container);
    }

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(40, 300, 240);

    (window as any).camera = camera;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);

    // model
    const loader = new ColladaLoader();

    loader.load('models/goblin-jab.dae', (object) => {
        models.jab = object;
        mixer = new THREE.AnimationMixer(object.scene);
        action = mixer.clipAction(object.animations[0]);
        actions.jab = action;
        object.scene.scale.set(2, 2, 2);
        scene?.add(object.scene);
        object.scene.receiveShadow = true;
    });

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Types are broken in threejs.
    (renderer as any).setClearColor(0x000000, 0);
    // Types are broken in threejs.
    (renderer as any).setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Types are broken in threejs.
    (renderer as any).shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    if (camera && renderer) {
        (camera as any).aspect = window.innerWidth / window.innerHeight;
        (camera as any).updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    if(mixer) {
        mixer.update(delta);
    }
    if (scene && renderer && camera) {
        renderer.render(scene, camera);
    }
}