import './style.css';
import { Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, TorusGeometry, WebGLRenderer } from 'three';

const { innerWidth, innerHeight } = window;
const scene = new Scene();
const camera = new PerspectiveCamera(75, innerWidth / innerHeight, .1, 1000);
const renderer = new WebGLRenderer();
let scaler = 1, debouncer = null;

renderer.setSize(innerWidth, innerHeight);
camera.position.z = 10;

document.body.appendChild(renderer.domElement);

// create torus;
const group = new Group();
const torusList = Array.from({ length: 50 }).map((_, i) => {
  const offset = i / 5000;
  const torusGeometry = new TorusGeometry(i * offset + 1.3, i * offset + .4, Math.floor(Math.random() * i) + 8, 100);
  const color = parseInt(new Array(3).fill(null).map(() => Math.floor(Math.random() * 254).toString(16)).join(''), 16);
  const material = new MeshBasicMaterial({ color });
  const torus = new Mesh(torusGeometry, material);
  group.add(torus);
  return torus;
});
scene.add(group);

function animate() {
  renderer.render(scene, camera);

  torusList.forEach((torus, i) => {
    const invert = i % 2 === 0 ? -1 : 1;
    const rotater = .001 * Math.random() * i * invert;
    torus.rotation.x += rotater;
    torus.rotation.y -= rotater;
    scaler = torus.scale.x > 15 ? -1 : torus.scale.x < 11 ? 1 : scaler;

    // boosting speed before ready
    if (torus.scale.x < 3) {
      torus.scale.x += 10;
    }
    if (torus.scale.y < 3) {
      torus.scale.y += 10;
    }

    torus.scale.x += (.05 * scaler);
    torus.scale.y += (.05 * scaler);
  });

  requestAnimationFrame(animate);
}

function resize() {
  if (debouncer) {
    clearTimeout(debouncer);
  }
  debouncer = setTimeout(() => {
    requestAnimationFrame(() => {
      const { innerWidth, innerHeight } = window;
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      debouncer = null;
    })
  }, 300);
}

window.addEventListener('resize', resize, false);
animate();