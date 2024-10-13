// 기본 Three.js 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 조명 추가
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// GLB 파일 로더 설정
const loader = new THREE.GLTFLoader();
loader.load('models/island.glb', function (gltf) {
  const model = gltf.scene;
  scene.add(model);
  model.position.set(0, 0, 0); // 위치 조정
  model.rotation.y = Math.PI / 4; // 회전 예시
}, undefined, function (error) {
  console.error(error);
});

// 카메라 위치 설정
camera.position.z = 5;

// 렌더 루프
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
