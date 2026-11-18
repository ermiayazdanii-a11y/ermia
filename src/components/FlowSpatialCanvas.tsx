import { MutableRefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FLOW_MEDIA_ASSETS } from '../data/flowProductData';
import type { ThemeMode } from '../styles/designTokens';
import {
  createProceduralFlowPhone,
  type FlowScreenKey,
} from '../three/flowPhoneModel';
import { evaluateFlowStoryPose } from '../three/flowStoryKeyframes';

interface FlowSpatialCanvasProps {
  progressRef: MutableRefObject<number>;
  manualScreenId: FlowScreenKey | null;
  theme: ThemeMode;
  isRtl: boolean;
  isMobile: boolean;
  isCenteredStage?: boolean;
  wakeRef: MutableRefObject<(() => void) | null>;
  onReady?: () => void;
  onFallback: () => void;
  onInspectActiveScreen?: () => void;
}

const SCREEN_SOURCES: Record<FlowScreenKey, { webp: string; jpg: string }> = {
  'today-dashboard': {
    webp: FLOW_MEDIA_ASSETS.screens.dashboard.webpSrc,
    jpg: FLOW_MEDIA_ASSETS.screens.dashboard.src,
  },
  'companion-sanctuary': {
    webp: FLOW_MEDIA_ASSETS.screens.companion.webpSrc,
    jpg: FLOW_MEDIA_ASSETS.screens.companion.src,
  },
  'focus-nebula': {
    webp: FLOW_MEDIA_ASSETS.screens.focus.webpSrc,
    jpg: FLOW_MEDIA_ASSETS.screens.focus.src,
  },
  'living-space-studio': {
    webp: FLOW_MEDIA_ASSETS.screens.themes.webpSrc,
    jpg: FLOW_MEDIA_ASSETS.screens.themes.src,
  },
};

function detectSoftwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
      if (/SwiftShader|llvmpipe|softpipe|Software/i.test(renderer)) {
        return true;
      }
    }
    const vendorRenderer = String(gl.getParameter(gl.RENDERER) || '');
    return /SwiftShader|llvmpipe|softpipe|Software/i.test(vendorRenderer);
  } catch {
    return false;
  }
}

export function FlowSpatialCanvas({
  progressRef,
  manualScreenId,
  theme,
  isRtl,
  isMobile,
  isCenteredStage = isMobile,
  wakeRef,
  onReady,
  onFallback,
  onInspectActiveScreen,
}: FlowSpatialCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef(theme);
  const isRtlRef = useRef(isRtl);
  const isMobileRef = useRef(isMobile);
  const isCenteredStageRef = useRef(isCenteredStage);
  const manualScreenRef = useRef<FlowScreenKey | null>(manualScreenId);
  const onInspectRef = useRef(onInspectActiveScreen);

  themeRef.current = theme;
  isRtlRef.current = isRtl;
  isMobileRef.current = isMobile;
  isCenteredStageRef.current = isCenteredStage;
  manualScreenRef.current = manualScreenId;
  onInspectRef.current = onInspectActiveScreen;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobileRef.current,
        alpha: true,
        powerPreference: isMobileRef.current ? 'default' : 'high-performance',
      });
    } catch {
      onFallback();
      return;
    }

    const glContext = renderer.getContext();
    if (!glContext) {
      renderer.dispose();
      onFallback();
      return;
    }

    const isSoftwareGl = detectSoftwareRenderer(glContext);
    const maxDpr = isMobileRef.current || isSoftwareGl ? 1.25 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 30);
    camera.position.set(0, 0.05, 4.0);
    renderer.setSize(width, height, false);

    // Physical RoomEnvironment PBR reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();

    // 3-Point Studio Light + Evolving Chapter Accent Rim Light
    const ambientLight = new THREE.AmbientLight(0xd9e0d5, 0.38);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ed, 2.15);
    keyLight.position.set(2.8, 3.6, 3.4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x9bd2ff, 1.15);
    fillLight.position.set(-3.2, 1.4, 2.1);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xd8f15a, 3.2, 10, 1.4);
    rimLight.position.set(-1.5, 1.2, -1.6);
    scene.add(rimLight);

    // Procedural Multi-Part Smartphone Assembly
    const phoneAssembly = createProceduralFlowPhone({
      simplified: isMobileRef.current,
      isSoftwareGl,
      theme: themeRef.current,
    });
    scene.add(phoneAssembly.rootGroup);

    // Texture Loader with .webp priority & .jpg fallback + capped anisotropy
    const loader = new THREE.TextureLoader();
    const loadedTextures: Partial<Record<FlowScreenKey, THREE.Texture>> = {};
    const maxAniso = Math.min(
      renderer.capabilities.getMaxAnisotropy(),
      isMobileRef.current || isSoftwareGl ? 2 : 6
    );
    let disposed = false;

    const loadScreenTexture = (id: FlowScreenKey) => {
      const paths = SCREEN_SOURCES[id];
      const configureTexture = (tex: THREE.Texture) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAniso;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        loadedTextures[id] = tex;
        wake();
      };

      loader.load(
        paths.webp,
        configureTexture,
        undefined,
        () => {
          if (disposed) return;
          loader.load(paths.jpg, configureTexture);
        }
      );
    };

    (Object.keys(SCREEN_SOURCES) as FlowScreenKey[]).forEach(loadScreenTexture);

    // Damped current state variables (zero GC allocations during animation)
    const initialPose = evaluateFlowStoryPose(progressRef.current, {
      isRtl: isRtlRef.current,
      isMobile: isCenteredStageRef.current,
      isDark: themeRef.current === 'dark',
    });

    const cur = {
      phoneX: initialPose.phoneX,
      phoneY: initialPose.phoneY,
      phoneZ: initialPose.phoneZ,
      rotX: initialPose.rotX,
      rotY: initialPose.rotY,
      rotZ: initialPose.rotZ,
      phoneScale: initialPose.phoneScale,
      camX: initialPose.camX,
      camY: initialPose.camY,
      camZ: initialPose.camZ,
      camFov: initialPose.camFov,
      orbitRotX: initialPose.orbitRotX,
      orbitRotY: initialPose.orbitRotY,
      orbitRotZ: initialPose.orbitRotZ,
      orbitScale: initialPose.orbitScale,
      plateSpread: initialPose.plateSpread,
      pointerX: 0,
      pointerY: 0,
      targetPointerX: 0,
      targetPointerY: 0,
    };

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const tempColor = new THREE.Color();

    let rafId: number | null = null;
    let lastTimestamp = performance.now();
    let isVisible = true;
    let isDocumentHidden = typeof document !== 'undefined' ? document.hidden : false;
    let settleFrames = 0;

    const plateBasePositions = phoneAssembly.floatingPlates.map((fp) =>
      fp.group.position.clone()
    );

    const renderFrame = (now: number) => {
      if (disposed || !isVisible || isDocumentHidden) {
        rafId = null;
        return;
      }

      const delta = Math.min((now - lastTimestamp) / 1000, 0.05);
      lastTimestamp = now;

      const target = evaluateFlowStoryPose(progressRef.current, {
        isRtl: isRtlRef.current,
        isMobile: isCenteredStageRef.current,
        isDark: themeRef.current === 'dark',
      });

      const dampLambda = 9.5;
      const pointerLambda = 7.0;

      cur.phoneX = THREE.MathUtils.damp(cur.phoneX, target.phoneX, dampLambda, delta);
      cur.phoneY = THREE.MathUtils.damp(cur.phoneY, target.phoneY, dampLambda, delta);
      cur.phoneZ = THREE.MathUtils.damp(cur.phoneZ, target.phoneZ, dampLambda, delta);
      cur.rotX = THREE.MathUtils.damp(cur.rotX, target.rotX, dampLambda, delta);
      cur.rotY = THREE.MathUtils.damp(cur.rotY, target.rotY, dampLambda, delta);
      cur.rotZ = THREE.MathUtils.damp(cur.rotZ, target.rotZ, dampLambda, delta);
      cur.phoneScale = THREE.MathUtils.damp(cur.phoneScale, target.phoneScale, dampLambda, delta);

      cur.camX = THREE.MathUtils.damp(cur.camX, target.camX, dampLambda, delta);
      cur.camY = THREE.MathUtils.damp(cur.camY, target.camY, dampLambda, delta);
      cur.camZ = THREE.MathUtils.damp(cur.camZ, target.camZ, dampLambda, delta);
      cur.camFov = THREE.MathUtils.damp(cur.camFov, target.camFov, dampLambda, delta);

      cur.orbitRotX = THREE.MathUtils.damp(cur.orbitRotX, target.orbitRotX, dampLambda, delta);
      cur.orbitRotY = THREE.MathUtils.damp(cur.orbitRotY, target.orbitRotY, dampLambda, delta);
      cur.orbitRotZ = THREE.MathUtils.damp(cur.orbitRotZ, target.orbitRotZ, dampLambda, delta);
      cur.orbitScale = THREE.MathUtils.damp(cur.orbitScale, target.orbitScale, dampLambda, delta);
      cur.plateSpread = THREE.MathUtils.damp(cur.plateSpread, target.plateSpread, dampLambda, delta);

      cur.pointerX = THREE.MathUtils.damp(cur.pointerX, cur.targetPointerX, pointerLambda, delta);
      cur.pointerY = THREE.MathUtils.damp(cur.pointerY, cur.targetPointerY, pointerLambda, delta);

      // Apply transforms to phone + orbital rings
      phoneAssembly.rootGroup.position.set(cur.phoneX, cur.phoneY, cur.phoneZ);
      phoneAssembly.rootGroup.scale.setScalar(cur.phoneScale);

      phoneAssembly.phoneBodyGroup.rotation.set(
        cur.rotX + cur.pointerY * 0.11,
        cur.rotY + cur.pointerX * 0.17,
        cur.rotZ
      );

      phoneAssembly.orbitalGroup.rotation.set(
        cur.orbitRotX - cur.pointerY * 0.08,
        cur.orbitRotY + cur.pointerX * 0.1,
        cur.orbitRotZ
      );
      phoneAssembly.orbitalGroup.scale.setScalar(cur.orbitScale);

      phoneAssembly.floatingPlates.forEach((fp, i) => {
        const base = plateBasePositions[i];
        fp.group.position.set(
          base.x * cur.plateSpread,
          base.y * (0.9 + cur.plateSpread * 0.1),
          base.z
        );
        fp.group.rotation.y = (i % 2 === 0 ? 0.16 : -0.16) + cur.pointerX * 0.12;
        fp.group.rotation.x = cur.pointerY * 0.1;
      });

      // Camera update
      camera.position.set(cur.camX, cur.camY, cur.camZ);
      if (Math.abs(camera.fov - cur.camFov) > 0.02) {
        camera.fov = cur.camFov;
        camera.updateProjectionMatrix();
      }
      camera.lookAt(cur.phoneX * 0.18, cur.phoneY * 0.18, 0);

      // Update dynamic OLED screen crossfade
      const overrideId = manualScreenRef.current;
      const keyA = overrideId ?? target.screenA;
      const keyB = overrideId ?? target.screenB;
      const texA = loadedTextures[keyA];
      const texB = loadedTextures[keyB];
      if (texA) phoneAssembly.screenUniforms.uTexA.value = texA;
      if (texB) phoneAssembly.screenUniforms.uTexB.value = texB;
      phoneAssembly.screenUniforms.uMix.value = overrideId ? 0 : target.screenMix;
      phoneAssembly.screenUniforms.uBrightness.value =
        themeRef.current === 'light' ? 1.02 : 0.98;

      // Update accent lighting & metallic tint
      tempColor.setHex(target.accentHex);
      rimLight.color.copy(tempColor);
      rimLight.position.set(
        (isRtlRef.current ? 1.5 : -1.5) + cur.phoneX * 0.5,
        1.1,
        -1.5
      );
      ambientLight.intensity = themeRef.current === 'light' ? 0.72 : 0.36;
      keyLight.intensity = themeRef.current === 'light' ? 2.45 : 2.15;
      phoneAssembly.setThemeAppearance(themeRef.current, target.accentHex);

      renderer.render(scene, camera);

      // Check settlement to eliminate idle GPU burn
      const residual =
        Math.abs(cur.phoneX - target.phoneX) +
        Math.abs(cur.phoneY - target.phoneY) +
        Math.abs(cur.phoneZ - target.phoneZ) +
        Math.abs(cur.rotX - target.rotX) +
        Math.abs(cur.rotY - target.rotY) +
        Math.abs(cur.pointerX - cur.targetPointerX) +
        Math.abs(cur.pointerY - cur.targetPointerY);

      if (residual < 0.0008) {
        settleFrames += 1;
      } else {
        settleFrames = 0;
      }

      if (settleFrames < 10) {
        rafId = requestAnimationFrame(renderFrame);
      } else {
        rafId = null;
      }
    };

    const wake = () => {
      if (disposed || !isVisible || isDocumentHidden) return;
      settleFrames = 0;
      if (rafId === null) {
        lastTimestamp = performance.now();
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    wakeRef.current = wake;

    // ResizeObserver for crisp container proportions
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(1, entry.contentRect.width);
        const h = Math.max(1, entry.contentRect.height);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        wake();
      }
    });
    resizeObserver.observe(container);

    // IntersectionObserver pausing offscreen WebGL rendering
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = Boolean(entries[0]?.isIntersecting);
        if (isVisible) wake();
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      isDocumentHidden = document.hidden;
      if (!isDocumentHidden) wake();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Fine desktop pointer parallax + click-to-inspect raycast
    let pointerDownPos: { x: number; y: number } | null = null;
    const handlePointerMove = (e: PointerEvent) => {
      if (isMobileRef.current || e.pointerType === 'touch') return;
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      cur.targetPointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      cur.targetPointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      wake();
    };

    const handlePointerLeave = () => {
      cur.targetPointerX = 0;
      cur.targetPointerY = 0;
      wake();
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!pointerDownPos) return;
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      pointerDownPos = null;
      if (dist > 8 || !onInspectRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObject(phoneAssembly.phoneBodyGroup, true);
      if (hits.length > 0) {
        onInspectRef.current();
      }
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    canvasEl.addEventListener('pointerleave', handlePointerLeave);
    canvasEl.addEventListener('pointerdown', handlePointerDown);
    canvasEl.addEventListener('pointerup', handlePointerUp);

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      if (rafId !== null) cancelAnimationFrame(rafId);
      onFallback();
    };
    canvasEl.addEventListener('webglcontextlost', handleContextLost);

    wake();
    onReady?.();

    return () => {
      disposed = true;
      wakeRef.current = null;
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvasEl.removeEventListener('pointermove', handlePointerMove);
      canvasEl.removeEventListener('pointerleave', handlePointerLeave);
      canvasEl.removeEventListener('pointerdown', handlePointerDown);
      canvasEl.removeEventListener('pointerup', handlePointerUp);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);

      (Object.values(loadedTextures) as THREE.Texture[]).forEach((t) => t?.dispose());
      envTarget.dispose();
      phoneAssembly.dispose();
      renderer.dispose();
      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
    // Re-initialize only if mobile complexity tier changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Wake renderer cleanly when theme, locale direction, responsive tier, or manual screen pill updates
  useEffect(() => {
    wakeRef.current?.();
  }, [theme, isRtl, isCenteredStage, manualScreenId, wakeRef]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-pointer select-none"
      aria-hidden="true"
    />
  );
}

export default FlowSpatialCanvas;
