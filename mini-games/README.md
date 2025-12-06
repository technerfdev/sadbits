# @mini-games - SadBits Mini Games

A React application for 3D mini-games built with React Three Fiber, Rapier physics engine, and Tailwind CSS.

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.9+
- **Framework**: React 19
- **Build Tool**: Vite 7
- **3D Graphics**: React Three Fiber (Three.js wrapper)
- **Physics Engine**: React Three Rapier
- **3D Utilities**: React Three Drei
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20+ ([Download](https://nodejs.org/))
- pnpm 10+ (`npm install -g pnpm`)
- A modern web browser with WebGL support

## Getting Started

### 1. Install Dependencies

```bash
cd mini-games
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

The application will start at `http://localhost:5173` (default Vite port).

## Available Scripts

### Development

```bash
pnpm dev                # Start development server
pnpm preview            # Preview production build locally
```

### Building

```bash
pnpm build              # Type-check and build for production
```

### Code Quality

```bash
pnpm lint               # Run ESLint
```

## Project Structure

```
mini-games/
├── src/
│   ├── components/         # React components
│   │   ├── ui/             # UI components (Radix UI)
│   │   └── games/          # Game-specific components
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets (models, textures, etc.)
├── components.json         # Component configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies & scripts
```

## 3D Development with React Three Fiber

### Basic Scene Setup

React Three Fiber provides a declarative way to work with Three.js:

```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      <OrbitControls />
    </Canvas>
  );
}
```

### Canvas Configuration

The `Canvas` component accepts configuration options:

```typescript
<Canvas
  camera={{ position: [0, 0, 5], fov: 75 }}
  shadows
  dpr={[1, 2]} // Device pixel ratio for retina displays
  gl={{ antialias: true }}
>
  {/* Your 3D scene */}
</Canvas>
```

### Using Drei Helpers

`@react-three/drei` provides useful abstractions:

```typescript
import {
  OrbitControls,     // Camera controls
  Sky,               // Sky background
  Environment,       // Environment maps
  PerspectiveCamera, // Camera helper
  Grid,              // Ground grid
  Text3D,            // 3D text
  useGLTF,           // Load 3D models
} from '@react-three/drei';

// Load a 3D model
function Model() {
  const { scene } = useGLTF('/path/to/model.gltf');
  return <primitive object={scene} />;
}

// Add sky
function Scene() {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <Model />
    </>
  );
}
```

## Physics with React Three Rapier

### Basic Physics Setup

```typescript
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';

function App() {
  return (
    <Canvas>
      <Physics gravity={[0, -9.81, 0]}>
        {/* Static ground */}
        <RigidBody type="fixed">
          <mesh position={[0, -2, 0]}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        </RigidBody>

        {/* Dynamic falling cube */}
        <RigidBody>
          <mesh position={[0, 5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>
      </Physics>
    </Canvas>
  );
}
```

### RigidBody Types

- `dynamic`: Affected by forces and collisions (default)
- `fixed`: Static objects (walls, ground)
- `kinematicPosition`: Programmatically controlled, affects others
- `kinematicVelocity`: Controlled by velocity, affects others

### Colliders and Shapes

```typescript
import { RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier';

function PhysicsObjects() {
  return (
    <>
      {/* Auto collider (matches mesh shape) */}
      <RigidBody colliders="cuboid">
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>

      {/* Custom collider */}
      <RigidBody>
        <BallCollider args={[0.5]} />
        <mesh>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>

      {/* Multiple colliders */}
      <RigidBody>
        <CuboidCollider args={[1, 1, 1]} />
        <CuboidCollider args={[0.5, 2, 0.5]} position={[0, 2, 0]} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </>
  );
}
```

### Forces and Impulses

```typescript
import { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';

function Ball() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  const handleClick = () => {
    if (rigidBodyRef.current) {
      // Apply impulse (instant force)
      rigidBodyRef.current.applyImpulse({ x: 0, y: 10, z: 0 }, true);

      // Apply force (continuous)
      rigidBodyRef.current.addForce({ x: 0, y: 5, z: 0 }, true);

      // Set velocity
      rigidBodyRef.current.setLinvel({ x: 0, y: 10, z: 0 }, true);
    }
  };

  return (
    <RigidBody ref={rigidBodyRef}>
      <mesh onClick={handleClick}>
        <sphereGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
```

### Collision Detection

```typescript
import { RigidBody } from '@react-three/rapier';

function Player() {
  const handleCollision = (event) => {
    console.log('Collided with:', event.other.rigidBodyObject.name);
  };

  return (
    <RigidBody
      name="player"
      onCollisionEnter={handleCollision}
    >
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}
```

## Animation and Interaction

### Using useFrame for Animation

```typescript
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function RotatingCube() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    // Rotate every frame
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

### Keyboard Controls

```typescript
import { useEffect, useState } from 'react';

function useKeyboard() {
  const [keys, setKeys] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => setKeys((prev) => ({ ...prev, [e.key]: true }));
    const handleKeyUp = (e) => setKeys((prev) => ({ ...prev, [e.key]: false }));

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}

// Usage in component
function Player() {
  const keys = useKeyboard();
  const rigidBodyRef = useRef();

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const impulse = { x: 0, y: 0, z: 0 };
    const speed = 5;

    if (keys['w']) impulse.z -= speed;
    if (keys['s']) impulse.z += speed;
    if (keys['a']) impulse.x -= speed;
    if (keys['d']) impulse.x += speed;

    rigidBodyRef.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody ref={rigidBodyRef}>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}
```

## Loading 3D Models

### GLTF/GLB Models

```typescript
import { useGLTF } from '@react-three/drei';

function Model({ url }) {
  const { scene, nodes, materials } = useGLTF(url);

  return <primitive object={scene} />;
}

// Preload for better performance
useGLTF.preload('/models/character.glb');
```

### Optimizing Models

1. Use compressed formats (GLB over GLTF)
2. Reduce polygon count
3. Optimize textures (use power-of-2 dimensions)
4. Use Draco compression
5. Preload models during loading screen

## Performance Optimization

### Level of Detail (LOD)

```typescript
import { Detailed } from '@react-three/drei';

function OptimizedModel() {
  return (
    <Detailed distances={[0, 10, 20]}>
      {/* High detail (close) */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial />
      </mesh>

      {/* Medium detail */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial />
      </mesh>

      {/* Low detail (far) */}
      <mesh>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial />
      </mesh>
    </Detailed>
  );
}
```

### Instancing for Multiple Objects

```typescript
import { Instances, Instance } from '@react-three/drei';

function ManyBoxes() {
  return (
    <Instances limit={1000}>
      <boxGeometry />
      <meshStandardMaterial />

      {Array.from({ length: 1000 }).map((_, i) => (
        <Instance
          key={i}
          position={[
            Math.random() * 10 - 5,
            Math.random() * 10,
            Math.random() * 10 - 5,
          ]}
        />
      ))}
    </Instances>
  );
}
```

### Performance Monitoring

```typescript
import { Perf } from 'r3f-perf';

function App() {
  return (
    <Canvas>
      <Perf position="top-left" />
      {/* Your scene */}
    </Canvas>
  );
}
```

## UI Components

The project includes Radix UI primitives for building accessible UI:

```typescript
import { Slot } from '@radix-ui/react-slot';
import { Button } from '@/components/ui/button';

function GameUI() {
  return (
    <div className="absolute top-0 left-0 p-4">
      <Button onClick={() => console.log('Start game')}>
        Start Game
      </Button>
    </div>
  );
}
```

## Styling with Tailwind CSS

Combine 3D canvas with Tailwind-styled UI:

```typescript
function Game() {
  return (
    <div className="relative w-screen h-screen">
      {/* 3D Canvas */}
      <Canvas className="absolute inset-0">
        {/* 3D content */}
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 right-4 bg-black/50 p-4 rounded-lg">
        <h2 className="text-white text-xl font-bold">Score: 100</h2>
      </div>
    </div>
  );
}
```

## Common Game Patterns

### Character Controller

```typescript
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

function CharacterController() {
  const rigidBodyRef = useRef();
  const keys = useKeyboard();

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const velocity = rigidBodyRef.current.linvel();
    const speed = 5;

    let newVelX = 0;
    let newVelZ = 0;

    if (keys['w']) newVelZ = -speed;
    if (keys['s']) newVelZ = speed;
    if (keys['a']) newVelX = -speed;
    if (keys['d']) newVelX = speed;

    rigidBodyRef.current.setLinvel({
      x: newVelX,
      y: velocity.y, // Preserve vertical velocity (jumping/falling)
      z: newVelZ,
    }, true);
  });

  return (
    <RigidBody ref={rigidBodyRef} lockRotations>
      <mesh>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  );
}
```

### Camera Follow

```typescript
import { useFrame, useThree } from '@react-three/fiber';

function CameraFollow({ target }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!target.current) return;

    const targetPosition = target.current.translation();

    camera.position.x = targetPosition.x;
    camera.position.y = targetPosition.y + 5;
    camera.position.z = targetPosition.z + 10;

    camera.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);
  });

  return null;
}
```

## Troubleshooting

### Canvas Not Rendering

1. Ensure parent container has defined dimensions:
   ```css
   .canvas-container {
     width: 100vw;
     height: 100vh;
   }
   ```

2. Check browser console for WebGL errors
3. Verify browser supports WebGL

### Performance Issues

1. Reduce polygon count in models
2. Use instancing for repeated objects
3. Implement LOD for distant objects
4. Optimize textures (size and format)
5. Use `@react-three/drei`'s `<PerformanceMonitor />` for automatic quality adjustment

### Physics Not Working

1. Ensure `<Physics>` wrapper is present
2. Check RigidBody configuration
3. Verify collider shapes match mesh geometry
4. Check gravity settings
5. Use physics debug mode:
   ```typescript
   <Physics debug>
     {/* Your physics objects */}
   </Physics>
   ```

### Models Not Loading

1. Verify file path is correct
2. Check browser network tab for 404 errors
3. Ensure model is in `public/` directory
4. Try preloading: `useGLTF.preload('/model.glb')`
5. Check model format (GLB is preferred)

## Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

The production build:
- Type-checks all TypeScript files
- Optimizes and bundles with Vite
- Compresses assets
- Outputs to `dist/` directory

## Deployment

The built files in `dist/` can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

### Deployment Considerations

1. Ensure 3D assets are optimized
2. Enable CDN for faster asset delivery
3. Use compressed model formats (Draco)
4. Implement loading screens
5. Test on various devices and browsers

## Resources

### Core Libraries
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [React Three Drei Helpers](https://github.com/pmndrs/drei)
- [React Three Rapier Physics](https://github.com/pmnd/react-three-rapier)
- [Three.js Documentation](https://threejs.org/docs/)

### Learning Resources
- [Three.js Journey](https://threejs-journey.com/)
- [React Three Fiber Examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)
- [Poimandres Discord](https://discord.gg/poimandres) - Community support

### Tools
- [Blender](https://www.blender.org/) - 3D modeling (free)
- [glTF Viewer](https://gltf-viewer.donmccurdy.com/) - Preview models
- [glTF Transform](https://gltf-transform.donmccurdy.com/) - Optimize models

### Asset Sources
- [Sketchfab](https://sketchfab.com/) - 3D models
- [Poly Haven](https://polyhaven.com/) - Free textures, HDRIs, models
- [Kenney.nl](https://kenney.nl/) - Free game assets

## License

MIT License
