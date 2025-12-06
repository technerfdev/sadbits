import React, { useEffect, useMemo } from "react";
import { useGraph, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useMovement } from "../../hooks/useKeyboard";
import * as THREE from "three";

const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function MainCharacter(props) {
  const group = React.useRef();
  const { isRunning, isWalking } = useMovement();

  // Load both animations
  const { scene: idleScene, animations: idleAnimations } =
    useGLTF("./idle-neutral.glb");
  const { animations: runAnimations } = useGLTF("./run.glb");
  const { animations: walkAnimations } = useGLTF("./walk.glb");

  const clone = React.useMemo(
    () => SkeletonUtils.clone(idleScene),
    [idleScene]
  );
  const { nodes, materials } = useGraph(clone);

  // Combine animations from both files
  const allAnimations = React.useMemo(() => {
    return [...idleAnimations, ...runAnimations, ...walkAnimations];
  }, [idleAnimations, runAnimations, walkAnimations]);

  const { actions } = useAnimations(allAnimations, group);

  // Determine current animation state
  const animationState = useMemo(() => {
    if (isRunning) return "run";
    if (isWalking) return "walk";
    return "idle";
  }, [isRunning, isWalking]);

  // Play animations based on state
  useEffect(() => {
    if (!actions) return;

    // Get the action names (they might be different, adjust based on your GLB files)
    const idleAction =
      actions[
        Object.keys(actions).find((key) =>
          key.toLowerCase().includes("idle")
        ) || Object.keys(actions)[0]
      ];
    const runAction =
      actions[
        Object.keys(actions).find((key) => key.toLowerCase().includes("run"))
      ];

    const walkAction =
      actions[
        Object.keys(actions).find((key) => key.toLowerCase().includes("walk"))
      ];

    switch (animationState) {
      case "walk":
        idleAction?.fadeOut(0.2);
        runAction?.fadeOut(0.2);
        walkAction.reset().play();
        break;
      case "run":
        idleAction?.fadeOut(0.2);
        walkAction?.fadeOut(0.2);
        runAction.reset().play();
        break;
      default:
        runAction.fadeOut();
        walkAction.fadeOut();
        idleAction?.reset().play();
    }
  }, [animationState, actions]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <group name="Casual_Feet" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Feet_1"
              geometry={nodes.Casual_Feet_1.geometry}
              material={materials.White}
              skeleton={nodes.Casual_Feet_1.skeleton}
            />
            <skinnedMesh
              name="Casual_Feet_2"
              geometry={nodes.Casual_Feet_2.geometry}
              material={materials.Purple}
              skeleton={nodes.Casual_Feet_2.skeleton}
            />
          </group>
          <group name="Casual_Legs" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Legs_1"
              geometry={nodes.Casual_Legs_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Legs_1.skeleton}
            />
            <skinnedMesh
              name="Casual_Legs_2"
              geometry={nodes.Casual_Legs_2.geometry}
              material={materials.LightBlue}
              skeleton={nodes.Casual_Legs_2.skeleton}
            />
          </group>
          <group name="Casual_Head" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Head_1"
              geometry={nodes.Casual_Head_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Head_1.skeleton}
            />
            <skinnedMesh
              name="Casual_Head_2"
              geometry={nodes.Casual_Head_2.geometry}
              material={materials.Eyebrows}
              skeleton={nodes.Casual_Head_2.skeleton}
            />
            <skinnedMesh
              name="Casual_Head_3"
              geometry={nodes.Casual_Head_3.geometry}
              material={materials.Eye}
              skeleton={nodes.Casual_Head_3.skeleton}
            />
            <skinnedMesh
              name="Casual_Head_4"
              geometry={nodes.Casual_Head_4.geometry}
              material={materials.Hair}
              skeleton={nodes.Casual_Head_4.skeleton}
            />
          </group>
          <group
            name="Casual_Body"
            position={[0, 0.007, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="Casual_Body_1"
              geometry={nodes.Casual_Body_1.geometry}
              material={materials.Purple}
              skeleton={nodes.Casual_Body_1.skeleton}
            />
            <skinnedMesh
              name="Casual_Body_2"
              geometry={nodes.Casual_Body_2.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Body_2.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./idle-neutral.glb");
useGLTF.preload("./run.glb");
useGLTF.preload("./walk.glb");
