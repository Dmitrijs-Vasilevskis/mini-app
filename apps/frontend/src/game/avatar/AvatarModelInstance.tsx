import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { AnimationAction, LoopOnce, LoopRepeat, Object3D } from "three";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import type { AvatarConfig } from "./avatar.config";
import type { PlayerAnimationEvent } from "../../store/playerAnimationStore";

type Props = {
  avatar: AvatarConfig;
  animationQueue: PlayerAnimationEvent[];
};

export function AvatarModelInstance({ avatar, animationQueue }: Props) {
  const groupRef = useRef<Object3D>(null);
  const { scene, animations } = useGLTF(avatar.modelPath);
  const { actions } = useAnimations(animations, groupRef);

  const clonedScene = useMemo(() => {
    return SkeletonUtils.clone(scene);
  }, [scene]);

  const queueRef = useRef<PlayerAnimationEvent[]>(animationQueue);
  const queueIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const currentActionRef = useRef<AnimationAction | null>(null);

  useEffect(() => {
    queueRef.current = animationQueue;

    if (!isPlayingRef.current) {
      processNextRef.current?.();
    }
  }, [animationQueue]);

  const processNextRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const idleAnimationName = avatar.animations.Idle;

    if (!idleAnimationName) {
      console.warn("Idle animation is not configured");
      return;
    }

    const idleAction = actions[idleAnimationName];

    if (!idleAction) {
      console.warn(`Animation "${idleAnimationName}" not found`);
      return;
    }

    const playIdle = () => {
      Object.values(actions).forEach((otherAction) => {
        if (otherAction && otherAction !== idleAction) {
          otherAction.stop();
        }
      });

      idleAction.reset();
      idleAction.setLoop(LoopRepeat, Infinity);
      idleAction.clampWhenFinished = false;
      idleAction.enabled = true;
      idleAction.setEffectiveWeight(1);
      idleAction.setEffectiveTimeScale(1);
      idleAction.play();

      currentActionRef.current = null;
      isPlayingRef.current = false;
    };

    const processNext = () => {
      if (isPlayingRef.current) {
        return;
      }

      const event = queueRef.current[queueIndexRef.current];

      if (!event) {
        playIdle();
        return;
      }

      queueIndexRef.current += 1;

      const animationName = avatar.animations[event.animation];

      if (!animationName) {
        console.warn(`Animation "${event.animation}" is not configured`);

        processNext();
        return;
      }

      const action = actions[animationName];

      if (!action) {
        console.warn(`Animation "${animationName}" not found`);

        processNext();
        return;
      }

      if (action === idleAction) {
        processNext();
        return;
      }

      isPlayingRef.current = true;

      Object.values(actions).forEach((otherAction) => {
        if (otherAction && otherAction !== action) {
          otherAction.stop();
        }
      });

      action.reset();
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.enabled = true;
      action.setEffectiveWeight(1);
      action.setEffectiveTimeScale(1);
      action.play();

      currentActionRef.current = action;

      const mixer = action.getMixer();

      const onFinished = () => {
        mixer.removeEventListener("finished", onFinished);

        action.stop();
        currentActionRef.current = null;
        isPlayingRef.current = false;

        processNext();
      };

      mixer.addEventListener("finished", onFinished);
    };

    processNextRef.current = processNext;

    processNext();

    return () => {
      processNextRef.current = null;

      Object.values(actions).forEach((action) => {
        action?.stop();
      });

      currentActionRef.current = null;
      isPlayingRef.current = false;
    };
  }, [actions, avatar]);

  return <primitive ref={groupRef} object={clonedScene} />;
}
