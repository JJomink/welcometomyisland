const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 조명 추가
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 방향광 추가
directionalLight.position.set(1, 1, 1).normalize(); // 방향 설정
scene.add(directionalLight);

// GLTFLoader를 사용하여 GLB 모델 로드
const loader = new THREE.GLTFLoader();
loader.load('/static/models/island.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(10, 10, 10);
    scene.add(model);
    model.position.set(0, 0, 0); // 모델 위치 조정
    scene.add(model);

    // 특정 오브젝트에 서로 다른 링크 설정
    model.traverse((child) => {
        if (child.isMesh) {
            child.cursor = 'pointer'; // 커서 모양 변경
            if (child.name === 'BeachBall') { // 첫 번째 오브젝트
                child.userData.link = 'https://makeownessence2-1.onrender.com/'; // 링크 설정
            } else if (child.name === 'SpiralShell') { // 두 번째 오브젝트
                child.userData.link = 'https://kyung110605.myportfolio.com/'; // 링크 설정
            }
            child.onClick = () => {
                window.open(child.userData.link, '_blank'); // 클릭 시 링크 열기
            };
        }
    });
}, undefined, (error) => {
    console.error(error);
});

// 파도 메쉬 생성
const waveGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
const waveMaterial = new THREE.MeshPhongMaterial({ color: 0x0077be, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
const wave = new THREE.Mesh(waveGeometry, waveMaterial);
wave.rotation.x = -Math.PI / 2; // 수평으로 놓기
scene.add(wave);

// 애니메이션 함수
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.002; // 시간 기반 애니메이션

    // 파도 효과: 각 정점의 Z 위치 조정
    const positionAttribute = waveGeometry.getAttribute('position');
    const positions = positionAttribute.array;

    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = Math.sin(positions[i] + time) * 0.5; // Z 방향으로 파도 효과
    }

    // 정점 변경 사항 적용
    positionAttribute.needsUpdate = true;

    renderer.render(scene, camera);
}

// 카메라 위치 설정
camera.position.set(0,2,5);
camera.lookAt(0,0,0);

// 마우스 클릭 처리
window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    // 클릭 좌표를 Normalized Device Coordinate (NDC)로 변환
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 레이캐스터를 통해 오브젝트 감지
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // 클릭한 오브젝트가 있으면 링크 열기
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData.link) {
            window.open(clickedObject.userData.link, '_blank');
        }
    }
});

// 리사이즈 처리
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 애니메이션 시작
animate();
