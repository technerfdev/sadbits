import { Suspense, type JSX } from "react";

import { MainCharacter } from "@/components/MainCharacter/MainCharacter.jsx";
import { Grid, OrbitControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import KeysPad from "./components/KeysPad/KeysPad";

export default function App(): JSX.Element {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
        }}
        className="flex relative h-full w-full"
      >
        <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={Math.PI / 2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <pointLight
            castShadow
            intensity={0.8}
            position={[-100, 100, 100]}
            decay={0}
          />

          <OrbitControls target={[0, -1, 0]} minDistance={3} maxDistance={15} />
          <Grid args={[100, 100]} position={[0, -0.99, 0]} />
          <MainCharacter position={[0, -1, 0]} />
        </Canvas>
        <KeysPad />
      </div>
    </Suspense>
  );
}
