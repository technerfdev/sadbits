import { useEffect, useRef, type JSX } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Create scene
const appScene = new THREE.Scene();
// appScene.background = new THREE.Color("white");

// Create camera instance
const appCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
appCamera.lookAt(0, 0, 0);

// Create render : load scene and camera
// antialias: true => smoother edges
const appRenderer = new THREE.WebGLRenderer({ antialias: true });
appRenderer.setSize(window.innerWidth, window.innerHeight);

const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
appScene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // ????
directionalLight.position.set(5, 5, 5);
appScene.add(directionalLight);

const loadModel = () => {
  const loader = new GLTFLoader();
  loader.load(
    "/src/assets/characters/main/idle-neutral.glb",
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, -1, 0);
      appScene.add(model);
    },
    (progress) => {
      console.log(
        `Loading model: ${(progress.loaded / progress.total) * 100} %loaded`
      );
    },
    (error) => {
      console.error(error);
    }
  );
};

export default function App(): JSX.Element {
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mainRef.current?.appendChild(appRenderer.domElement);

    // Set camera position
    appCamera.position.z = 5; /// default

    const animate = () => {
      requestAnimationFrame(animate);
      appRenderer.render(appScene, appCamera);
    };

    animate();
    loadModel();

    return () => {
      mainRef.current?.removeChild(appRenderer.domElement);
      appRenderer.dispose();
    };
  }, []);

  return <div ref={mainRef} />;
}
