import * as THREE from 'three';

interface AnimationOptions {
  container: HTMLElement;
  cameraPosition?: { x: number; y: number; z: number };
  colors?: string[];
  rotationSpeed?: number;
}

export function createHeroAnimation({
  container,
  cameraPosition = { x: 0, y: 0, z: 6 },
  colors = ['#0CFFE1', '#8A2BE2', '#FF1493', '#FFFFFF'],
  rotationSpeed = 0.003
}: AnimationOptions): () => void {
  if (!container) return () => {};

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0x0CFFE1, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  const directionalLight2 = new THREE.DirectionalLight(0x8A2BE2, 0.8);
  directionalLight2.position.set(-1, -1, -1);
  scene.add(directionalLight2);
  
  // Create a group of objects
  const group = new THREE.Group();
  scene.add(group);
  
  // Create multiple objects
  const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.BoxGeometry(1.2, 1.2, 1.2),
    new THREE.TorusGeometry(0.7, 0.3, 16, 100),
    new THREE.ConeGeometry(0.8, 1.6, 32)
  ];
  
  const colorHexValues = colors.map(color => new THREE.Color(color).getHex());
  
  const materials = colorHexValues.map(color => 
    new THREE.MeshPhongMaterial({ 
      color, 
      wireframe: color === new THREE.Color('#FFFFFF').getHex() 
    })
  );
  
  const objects: THREE.Mesh[] = [];
  
  for (let i = 0; i < 8; i++) {
    const geometry = geometries[i % geometries.length];
    const material = materials[i % materials.length];
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random position
    mesh.position.x = (Math.random() - 0.5) * 5;
    mesh.position.y = (Math.random() - 0.5) * 5;
    mesh.position.z = (Math.random() - 0.5) * 5;
    
    // Random rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Random scale
    const scale = 0.4 + Math.random() * 0.6;
    mesh.scale.set(scale, scale, scale);
    
    objects.push(mesh);
    group.add(mesh);
  }
  
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  
  // Animation loop
  let animationFrameId: number;
  
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Rotate group
    group.rotation.y += rotationSpeed;
    group.rotation.x += rotationSpeed / 2;
    
    // Animate individual objects
    objects.forEach((obj, i) => {
      obj.rotation.x += 0.01 * (i % 2 ? 1 : -1);
      obj.rotation.y += 0.01 * (i % 3 ? 1 : -1);
    });
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Handle window resize
  const handleResize = () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationFrameId);
    if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
    
    // Dispose geometries and materials
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    
    // Clear memory
    objects.length = 0;
  };
}

export function createStatsAnimation(container: HTMLElement, data: { label: string; value: number }[]): () => void {
  if (!container) return () => {};
  
  // Scene setup
  const scene = new THREE.Scene();
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0x0CFFE1, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Create bars
  const barGroup = new THREE.Group();
  scene.add(barGroup);
  
  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = 0.6;
  const barDepth = 0.3;
  const spacing = 1.2;
  const startX = -(data.length - 1) * spacing / 2;
  
  const barMaterials = [
    new THREE.MeshPhongMaterial({ color: 0x0CFFE1 }),
    new THREE.MeshPhongMaterial({ color: 0x8A2BE2 }),
    new THREE.MeshPhongMaterial({ color: 0xFF1493 })
  ];
  
  const bars: THREE.Mesh[] = [];
  
  data.forEach((item, index) => {
    // Normalize height between 1 and 3
    const normalizedHeight = (item.value / maxValue) * 2 + 1;
    const barGeometry = new THREE.BoxGeometry(barWidth, normalizedHeight, barDepth);
    const barMaterial = barMaterials[index % barMaterials.length];
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    
    bar.position.x = startX + index * spacing;
    bar.position.y = normalizedHeight / 2;
    
    barGroup.add(bar);
    bars.push(bar);
  });
  
  camera.position.z = 7;
  
  // Animation loop
  let animationFrameId: number;
  
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Animate bars
    bars.forEach((bar, index) => {
      // Gently float up and down
      bar.position.y = (data[index].value / maxValue) * 2 + 1 + Math.sin(Date.now() * 0.001 + index) * 0.1;
      // Slight rotation
      bar.rotation.y += 0.005;
    });
    
    // Rotate the entire group slowly
    barGroup.rotation.y += 0.002;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Handle window resize
  const handleResize = () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationFrameId);
    if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
    
    // Dispose geometries and materials
    bars.forEach(bar => {
      if (bar.geometry) bar.geometry.dispose();
      if (Array.isArray(bar.material)) {
        bar.material.forEach(mat => mat.dispose());
      } else if (bar.material) {
        bar.material.dispose();
      }
    });
    
    // Clear memory
    bars.length = 0;
  };
}
