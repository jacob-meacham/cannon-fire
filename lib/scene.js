import THREE from 'three';
import dat from 'dataarts/dat.gui/build/dat.gui.min.js';
import Stats from 'mrdoob/stats.js/build/stats.min.js';

function appendToBody(node) {
      // Code to make sure that we can serve the bundle, or serve through jspm-server
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', function _func() {
        document.body.appendChild(node);
        document.removeEventListener('DOMContentLoaded', _func);
      });
    } else {
      document.body.appendChild(node);
    }
}

class CannonScene {
  constructor() {
    this.speed = 0.1;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;

    appendToBody(this.renderer.domElement);
  }

  update() {
    this.cube.rotation.x += this.speed;
    this.cube.rotation.y += this.speed;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  reload() {
    document.body.removeChild(this.renderer.domElement);
  }
}

const scene = new CannonScene();

// Initialize the GUI
const gui = new dat.GUI();
gui.add(scene, 'speed', -0.2, 0.2);

const stats = new Stats();
stats.setMode(0);
const statsContainer = document.createElement('div');
statsContainer.setAttribute('class', 'stats');
statsContainer.appendChild(stats.domElement);
appendToBody(statsContainer);

// Main loop
function update() {
  stats.begin();

  scene.update();
  scene.render();

  stats.end();

  requestAnimationFrame(update);
}

// Kick off the update loop
update();

export function __hotReload() {
  scene.reload();

  // Remove the gui:
  gui.domElement.parentNode.removeChild(gui.domElement);
  statsContainer.removeChild(stats.domElement);
  return true;
}
