

import { useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore - CSS3DRenderer may not have proper types
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { products } from "@/data/products";
import { useNavigate } from "react-router-dom";


const CircularProductSlider = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      1,
      5000,
    );
    camera.position.set(0, 0, 1000);

    const renderer = new CSS3DRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.pointerEvents = "auto";
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const radius = 550;
    const verticalWave = 70;

    const cleanupCallbacks: Array<() => void> = [];

    const sliderProducts = products.filter((p) => p.id !== 10);

    sliderProducts.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "circular-slider-card";

      const inner = document.createElement("div");
      inner.className = "circular-slider-card__inner";

      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;
      image.className = "circular-slider-card__image";

      inner.appendChild(image);
      card.appendChild(inner);

      const cssObject = new CSS3DObject(card);
      const angle = (index / sliderProducts.length) * Math.PI * 2;

      cssObject.position.set(
        Math.sin(angle) * radius,
        Math.sin(angle * 1.6) * verticalWave,
        Math.cos(angle) * radius,
      );

      cssObject.lookAt(new THREE.Vector3(0, 0, 0));
      group.add(cssObject);

      const handleCardClick = () => navigate("/gallery");

      card.addEventListener("click", handleCardClick);

      cleanupCallbacks.push(() => {
        card.removeEventListener("click", handleCardClick);
      });
    });

    const onResize = () => {
      if (!container) {
        return;
      }

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", onResize);

    let animationFrame = 0;
    let rotation = 0;
    let velocity = 0.003;
    let isPointerDown = false;
    let lastX = 0;

    const damp = (value: number, smoothing = 0.9) => value * smoothing;

    const onPointerDown = (event: PointerEvent) => {
      isPointerDown = true;
      lastX = event.clientX;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isPointerDown) {
        return;
      }
      const currentX = event.clientX;
      const delta = currentX - lastX;
      lastX = currentX;

      const movement = delta / container.clientWidth;
      velocity = movement * 0.5;
      rotation += movement * Math.PI;
    };

    const onPointerUp = () => {
      isPointerDown = false;
    };

    const onWheel = (event: WheelEvent) => {
      velocity += (event.deltaY * -1) / 2000;
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: true });

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      if (!isPointerDown) {
        velocity = THREE.MathUtils.lerp(velocity, 0.0065, 0.02);
      }

      rotation += velocity;
      velocity = damp(velocity, isPointerDown ? 0.97 : 0.985);

      group.rotation.y = rotation;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      cleanupCallbacks.forEach((callback) => callback());
      renderer.domElement.remove();
    };
  }, [navigate]);

  return (
    <div className="circular-slider">
      <div className="circular-slider__canvas" ref={containerRef} aria-label="Highlighted products carousel" />
    </div>
  );
};

export default CircularProductSlider;
