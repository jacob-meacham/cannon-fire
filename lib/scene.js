import THREE from 'three';
import dat from 'dataarts/dat.gui/build/dat.gui.min.js';

class CannonScene {
  constructor() {
    this.speed = 0.1;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Code to make sure that we can serve the bundle, or serve through jspm-server
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(this.renderer.domElement);
      });
    } else {
      document.body.appendChild(this.renderer.domElement);
    }

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;
  }

  render() {
    this.cube.rotation.x += this.speed;
    this.cube.rotation.y += this.speed;

    this.renderer.render(this.scene, this.camera);
  }

  reload() {
    document.body.removeChild(this.renderer.domElement);
  }
}

const scene = new CannonScene();
const gui = new dat.GUI();
gui.add(scene, 'speed', -0.2, 0.2);


// Main render loop
function renderLoop() {
  requestAnimationFrame(renderLoop);
  scene.render();
}

// Kick off the render loop
renderLoop();

export function __hotReload() {
  scene.reload();

  // Remove the gui:
  gui.domElement.parentNode.removeChild(gui.domElement);
  return true;
}
