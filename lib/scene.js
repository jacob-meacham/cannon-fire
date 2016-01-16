import THREE from 'three';
import dat from 'dataarts/dat.gui/build/dat.gui.min.js';
import Stats from 'mrdoob/stats.js/build/stats.min.js';
import createBackground from 'three-vignette-background';

// TODO: Can this be done as an import?
//import EffectComposer from 'hughsk/three-effectcomposer';

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
    this.clock = new THREE.Clock();
    this.speed = 0.1;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xa0a0a0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const particleTexture = THREE.ImageUtils.loadTexture('./lib/particle.png');
    this.smokeParticles = new THREE.Geometry();
    for (let i = 0; i < 300; i++) {
      const particle = new THREE.Vector3(Math.random() * 1, Math.random() * 5, Math.random() * 1);
      this.smokeParticles.vertices.push(particle);
    }
    const smokeMaterial = new THREE.PointsMaterial({ map: particleTexture,
      transparent: true,
      //opacity: 0.5,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.5,
      //size: 0.8,
      color: 0x999999
    });

    const background = createBackground();
    this.scene.add(background);

    const smokeSystem = new THREE.Points(this.smokeParticles, smokeMaterial);
    smokeSystem.sortParticles = true;
    smokeSystem.position.x = -5;
    this.scene.add(smokeSystem);

    this.floaters = new THREE.Geometry();
    for (let i = 0; i < 2000; i++) {
      const particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
      this.floaters.vertices.push(particle);
    }

    const floaterMaterial = new THREE.PointsMaterial({ map: particleTexture, size: 2, transparent: true });
    const floaterSystem = new THREE.Points(this.floaters, floaterMaterial);
    this.scene.add(floaterSystem);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.scene.add(this.cube);

    this.camera.position.z = 5;

    //this.composer = new EffectComposer(this.renderer);
    //this.composer.addPass(new EffectComposer.RenderPass(this.scene, this.camera));

    appendToBody(this.renderer.domElement);

    window.addEventListener('resize', self.onWindowResize, false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.effectComposer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    const delta = this.clock.getDelta();
    this.cube.rotation.x += this.speed * delta;
    this.cube.rotation.y += this.speed * delta;

    for (const particle of this.floaters.vertices) {
      particle.x += 0.1;
      if (particle.x >= 300) {
        particle.x = -250;
        particle.y = Math.random() * 500 - 250;
        particle.z = Math.random() * 500 - 250;
      }
    }
    this.floaters.verticesNeedUpdate = true;

    for (const particle of this.smokeParticles.vertices) {
      particle.y += 0.01 + Math.random() * 0.05;
      if (Math.random() < 0.5) {
        particle.x -= 0.05 * Math.random();
      } else {
        particle.x += 0.05 * Math.random();
      }
      if (particle.y > 2) {
        particle.x += 0.01 + 0.05 * Math.random();
      }
      if (particle.y > 5) {
        particle.y = Math.random();
        particle.x = Math.random();
        particle.z = Math.random();
      }
    }
    this.smokeParticles.verticesNeedUpdate = true;

    //this.floaterSystem.position.x += 0.1;
  }

  render() {
    //this.composer.render();
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
