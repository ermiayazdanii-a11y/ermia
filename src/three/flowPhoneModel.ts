import * as THREE from 'three';

export type FlowScreenKey =
  | 'today-dashboard'
  | 'companion-sanctuary'
  | 'focus-nebula'
  | 'living-space-studio';

export interface FlowPhoneBuildOptions {
  simplified?: boolean;
  isSoftwareGl?: boolean;
  theme?: 'dark' | 'light';
}

export interface FlowFloatingPlateHandle {
  group: THREE.Group;
  frameMesh: THREE.Mesh;
  plateMesh: THREE.Mesh;
}

export interface FlowPhoneAssembly {
  rootGroup: THREE.Group;
  phoneBodyGroup: THREE.Group;
  orbitalGroup: THREE.Group;
  outerRing: THREE.Mesh;
  innerRing: THREE.Mesh;
  floatingPlates: FlowFloatingPlateHandle[];
  screenUniforms: {
    uTexA: { value: THREE.Texture };
    uTexB: { value: THREE.Texture };
    uMix: { value: number };
    uBrightness: { value: number };
  };
  setThemeAppearance: (theme: 'dark' | 'light', accentHex: number) => void;
  dispose: () => void;
}

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const hw = width * 0.5;
  const hh = height * 0.5;
  const r = Math.min(radius, hw, hh);

  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return shape;
}

/**
 * Generates a flat rounded rectangle ShapeGeometry with normalized [0..1] UVs
 * preserving exact 1080:2460 OLED display proportions with zero stretch.
 */
function createNormalizedRoundedPlaneGeometry(
  width: number,
  height: number,
  radius: number,
  curveSegments: number
): THREE.ShapeGeometry {
  const shape = createRoundedRectShape(width, height, radius);
  const geometry = new THREE.ShapeGeometry(shape, curveSegments);
  const pos = geometry.attributes.position;
  const uv = new Float32Array(pos.count * 2);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uv[i * 2] = (x + width * 0.5) / width;
    uv[i * 2 + 1] = (y + height * 0.5) / height;
  }

  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geometry.computeVertexNormals();
  return geometry;
}

function createFallbackTexture(): THREE.DataTexture {
  const data = new Uint8Array([14, 18, 16, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createProceduralFlowPhone(
  options: FlowPhoneBuildOptions = {}
): FlowPhoneAssembly {
  const simplified = Boolean(options.simplified);
  const isSoftwareGl = Boolean(options.isSoftwareGl);
  const curveSegments = simplified ? 10 : 20;
  const bevelSegments = simplified ? 2 : 4;

  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];
  const disposableTextures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    disposableGeometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    disposableMaterials.push(m);
    return m;
  };

  const rootGroup = new THREE.Group();
  const phoneBodyGroup = new THREE.Group();
  rootGroup.add(phoneBodyGroup);

  // Authentic flagship Android proportions: 1080:2460 OLED inside machined chassis
  const bodyW = 1.0;
  const bodyH = 2.22;
  const bodyD = 0.092;
  const bodyR = 0.132;
  const halfD = bodyD * 0.5;

  // 1. Machined Brushed-Titanium Chassis Frame
  const chassisShape = createRoundedRectShape(bodyW, bodyH, bodyR);
  const chassisGeo = trackGeo(
    new THREE.ExtrudeGeometry(chassisShape, {
      depth: bodyD - 0.022,
      bevelEnabled: true,
      bevelThickness: 0.011,
      bevelSize: 0.011,
      bevelSegments,
      curveSegments,
    })
  );
  chassisGeo.center();

  const titaniumMaterial = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x2a2f29,
      metalness: isSoftwareGl ? 0.65 : 0.88,
      roughness: isSoftwareGl ? 0.34 : 0.24,
      envMapIntensity: 1.35,
    })
  );

  const chassisMesh = new THREE.Mesh(chassisGeo, titaniumMaterial);
  chassisMesh.name = 'titanium-chassis';
  phoneBodyGroup.add(chassisMesh);

  // 2. Stepped Dark Anodized Front Bezel
  const bezelW = 0.962;
  const bezelH = 2.164;
  const bezelR = 0.114;
  const bezelGeo = trackGeo(
    createNormalizedRoundedPlaneGeometry(bezelW, bezelH, bezelR, curveSegments)
  );
  const bezelMaterial = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x090b0a,
      metalness: 0.28,
      roughness: 0.26,
      envMapIntensity: 0.8,
    })
  );
  const bezelMesh = new THREE.Mesh(bezelGeo, bezelMaterial);
  bezelMesh.position.z = halfD + 0.0008;
  phoneBodyGroup.add(bezelMesh);

  // 3. Recessed Active OLED Display (exact 1080:2460 aspect ratio -> 0.908 / 2.068)
  const screenW = 0.908;
  const screenH = 2.068;
  const screenR = 0.088;
  const screenGeo = trackGeo(
    createNormalizedRoundedPlaneGeometry(screenW, screenH, screenR, curveSegments)
  );

  const fallbackTex = createFallbackTexture();
  disposableTextures.push(fallbackTex);

  const screenUniforms = {
    uTexA: { value: fallbackTex as THREE.Texture },
    uTexB: { value: fallbackTex as THREE.Texture },
    uMix: { value: 0 },
    uBrightness: { value: 1.0 },
  };

  const screenMaterial = trackMat(
    new THREE.ShaderMaterial({
      uniforms: screenUniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTexA;
        uniform sampler2D uTexB;
        uniform float uMix;
        uniform float uBrightness;
        varying vec2 vUv;

        void main() {
          vec4 a = texture2D(uTexA, vUv);
          vec4 b = texture2D(uTexB, vUv);
          vec3 mixedColor = mix(a.rgb, b.rgb, clamp(uMix, 0.0, 1.0));
          // Subtle OLED edge vignette for physical depth under glass
          vec2 d = abs(vUv - 0.5) * 2.0;
          float edge = smoothstep(0.92, 1.03, max(d.x, d.y));
          mixedColor *= (1.0 - edge * 0.06) * uBrightness;
          gl_FragColor = vec4(mixedColor, 1.0);
          #include <colorspace_fragment>
        }
      `,
      toneMapped: false,
    })
  );

  const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
  screenMesh.position.z = halfD + 0.0022;
  screenMesh.name = 'oled-screen';
  phoneBodyGroup.add(screenMesh);

  // 4. Front Punch-Hole Camera & Top Earpiece Micro-Slit
  const cameraPunchGeo = trackGeo(new THREE.CircleGeometry(0.017, simplified ? 12 : 20));
  const lensDarkMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x050709,
      metalness: 0.9,
      roughness: 0.14,
    })
  );
  const punchMesh = new THREE.Mesh(cameraPunchGeo, lensDarkMat);
  punchMesh.position.set(0, screenH * 0.5 - 0.044, halfD + 0.003);
  phoneBodyGroup.add(punchMesh);

  const lensRingGeo = trackGeo(new THREE.RingGeometry(0.016, 0.022, simplified ? 12 : 20));
  const lensTrimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x3b444e,
      metalness: 0.85,
      roughness: 0.25,
    })
  );
  const punchRingMesh = new THREE.Mesh(lensRingGeo, lensTrimMat);
  punchRingMesh.position.set(0, screenH * 0.5 - 0.044, halfD + 0.0031);
  phoneBodyGroup.add(punchRingMesh);

  if (!simplified) {
    const slitGeo = trackGeo(createNormalizedRoundedPlaneGeometry(0.14, 0.008, 0.004, 6));
    const slitMesh = new THREE.Mesh(slitGeo, lensTrimMat);
    slitMesh.position.set(0, bezelH * 0.5 - 0.022, halfD + 0.0018);
    phoneBodyGroup.add(slitMesh);
  }

  // 5. Front Optical Cover Glass (clearcoat reflection layer catching RoomEnvironment)
  const glassGeo = trackGeo(
    createNormalizedRoundedPlaneGeometry(bezelW - 0.006, bezelH - 0.006, bezelR - 0.004, curveSegments)
  );
  const coverGlassMat = trackMat(
    isSoftwareGl
      ? new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.2,
          roughness: 0.08,
          transparent: true,
          opacity: 0.055,
          depthWrite: false,
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0xeaf2ee,
          metalness: 0.0,
          roughness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          reflectivity: 0.95,
          ior: 1.52,
          transparent: true,
          opacity: 0.075,
          depthWrite: false,
          envMapIntensity: 1.5,
        })
  );
  const coverGlassMesh = new THREE.Mesh(glassGeo, coverGlassMat);
  coverGlassMesh.position.z = halfD + 0.0045;
  phoneBodyGroup.add(coverGlassMesh);

  // 6. Matte Frosted Obsidian Backplate
  const backGeo = trackGeo(
    createNormalizedRoundedPlaneGeometry(bezelW - 0.008, bezelH - 0.008, bezelR - 0.004, curveSegments)
  );
  const backMaterial = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x131613,
      metalness: 0.18,
      roughness: 0.42,
      envMapIntensity: 0.9,
    })
  );
  const backMesh = new THREE.Mesh(backGeo, backMaterial);
  backMesh.rotation.y = Math.PI;
  backMesh.position.z = -(halfD + 0.0009);
  phoneBodyGroup.add(backMesh);

  // 7. Raised Machined Camera Island & Triple Sapphire Optics (visible on 60% three-quarter rotation)
  const islandGroup = new THREE.Group();
  islandGroup.position.set(-0.22, 0.72, -(halfD + 0.012));
  islandGroup.rotation.y = Math.PI;
  phoneBodyGroup.add(islandGroup);

  const islandShape = createRoundedRectShape(0.39, 0.49, 0.075);
  const islandGeo = trackGeo(
    new THREE.ExtrudeGeometry(islandShape, {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: simplified ? 1 : 3,
      curveSegments: simplified ? 8 : 14,
    })
  );
  islandGeo.center();

  const islandMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1d211d,
      metalness: 0.78,
      roughness: 0.24,
      envMapIntensity: 1.35,
    })
  );
  const islandMesh = new THREE.Mesh(islandGeo, islandMat);
  islandGroup.add(islandMesh);

  const lensRingBezelGeo = trackGeo(
    new THREE.CylinderGeometry(0.068, 0.071, 0.02, simplified ? 16 : 28)
  );
  lensRingBezelGeo.rotateX(Math.PI * 0.5);

  const lensCoreGeo = trackGeo(new THREE.CircleGeometry(0.048, simplified ? 16 : 24));
  const sapphireMat = trackMat(
    isSoftwareGl
      ? new THREE.MeshStandardMaterial({
          color: 0x0b1520,
          metalness: 0.85,
          roughness: 0.12,
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0x09131e,
          metalness: 0.15,
          roughness: 0.06,
          clearcoat: 1.0,
          clearcoatRoughness: 0.03,
          reflectivity: 1.0,
          envMapIntensity: 1.8,
        })
  );

  const lensPositions: [number, number][] = [
    [-0.088, 0.12],
    [-0.088, -0.12],
    [0.095, 0.0],
  ];

  lensPositions.forEach(([lx, ly]) => {
    const bezel = new THREE.Mesh(lensRingBezelGeo, titaniumMaterial);
    bezel.position.set(lx, ly, 0.014);
    islandGroup.add(bezel);

    const glass = new THREE.Mesh(lensCoreGeo, sapphireMat);
    glass.position.set(lx, ly, 0.025);
    islandGroup.add(glass);
  });

  // LED Flash & Sensor Accent
  const flashGeo = trackGeo(new THREE.CircleGeometry(0.021, 14));
  const flashMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf4e3b8,
      emissive: 0x3b311b,
      roughness: 0.25,
    })
  );
  const flashMesh = new THREE.Mesh(flashGeo, flashMat);
  flashMesh.position.set(0.095, 0.145, 0.015);
  islandGroup.add(flashMesh);

  // 8. Machined Side Hardware Buttons & Bottom USB-C Port Bezel
  const powerBtnGeo = trackGeo(new THREE.BoxGeometry(0.018, 0.145, 0.028));
  const powerBtn = new THREE.Mesh(powerBtnGeo, titaniumMaterial);
  powerBtn.position.set(bodyW * 0.5 + 0.008, 0.26, 0);
  phoneBodyGroup.add(powerBtn);

  const volBtnGeo = trackGeo(new THREE.BoxGeometry(0.018, 0.28, 0.028));
  const volBtn = new THREE.Mesh(volBtnGeo, titaniumMaterial);
  volBtn.position.set(bodyW * 0.5 + 0.008, 0.55, 0);
  phoneBodyGroup.add(volBtn);

  const usbcGeo = trackGeo(new THREE.BoxGeometry(0.14, 0.014, 0.036));
  const usbcMesh = new THREE.Mesh(usbcGeo, lensDarkMat);
  usbcMesh.position.set(0, -bodyH * 0.5 + 0.003, 0);
  phoneBodyGroup.add(usbcMesh);

  // 9. Spatial 3D Orbital Framing Rings & Floating Glass Plates (Part 3)
  const orbitalGroup = new THREE.Group();
  rootGroup.add(orbitalGroup);

  const outerRingGeo = trackGeo(
    new THREE.TorusGeometry(1.42, 0.0045, simplified ? 6 : 10, simplified ? 48 : 96)
  );
  const outerRingMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xd8f15a,
      transparent: true,
      opacity: 0.26,
    })
  );
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.rotation.set(Math.PI * 0.42, Math.PI * 0.14, 0);
  orbitalGroup.add(outerRing);

  const innerRingGeo = trackGeo(
    new THREE.TorusGeometry(1.16, 0.0035, simplified ? 6 : 10, simplified ? 44 : 84)
  );
  const innerRingMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.2,
    })
  );
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRing.rotation.set(-Math.PI * 0.36, Math.PI * 0.22, 0);
  if (simplified) {
    innerRing.visible = false;
  }
  orbitalGroup.add(innerRing);

  // Perspective-accurate beveled 3D translucent glass plates around device
  const floatingPlates: FlowFloatingPlateHandle[] = [];
  const plateConfigs = simplified
    ? [{ w: 0.48, h: 0.24, r: 0.04, pos: [-0.88, 0.42, -0.34] as [number, number, number] }]
    : [
        { w: 0.56, h: 0.28, r: 0.045, pos: [-0.96, 0.48, -0.26] as [number, number, number] },
        { w: 0.5, h: 0.25, r: 0.042, pos: [0.96, -0.34, -0.32] as [number, number, number] },
        { w: 0.44, h: 0.22, r: 0.038, pos: [0.76, 0.64, -0.45] as [number, number, number] },
      ];

  plateConfigs.forEach((cfg) => {
    const pGroup = new THREE.Group();
    pGroup.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);

    const plateGeo = trackGeo(
      createNormalizedRoundedPlaneGeometry(cfg.w, cfg.h, cfg.r, simplified ? 6 : 12)
    );
    const plateMat = trackMat(
      isSoftwareGl
        ? new THREE.MeshStandardMaterial({
            color: 0x1e2822,
            metalness: 0.3,
            roughness: 0.2,
            transparent: true,
            opacity: 0.34,
            side: THREE.DoubleSide,
          })
        : new THREE.MeshPhysicalMaterial({
            color: 0xdbe8d8,
            metalness: 0.05,
            roughness: 0.14,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide,
            envMapIntensity: 1.4,
          })
    );
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);

    const frameShape = createRoundedRectShape(cfg.w + 0.016, cfg.h + 0.016, cfg.r + 0.004);
    const hole = createRoundedRectShape(cfg.w - 0.008, cfg.h - 0.008, cfg.r - 0.002);
    frameShape.holes.push(hole);
    const frameGeo = trackGeo(new THREE.ShapeGeometry(frameShape, simplified ? 6 : 12));
    const frameMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xd8f15a,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
      })
    );
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.z = 0.002;

    pGroup.add(plateMesh);
    pGroup.add(frameMesh);
    orbitalGroup.add(pGroup);

    floatingPlates.push({
      group: pGroup,
      frameMesh,
      plateMesh,
    });
  });

  const setThemeAppearance = (theme: 'dark' | 'light', accentHex: number) => {
    const isLight = theme === 'light';
    titaniumMaterial.color.setHex(isLight ? 0x62695e : 0x2a2f29);
    backMaterial.color.setHex(isLight ? 0x2a3029 : 0x131613);
    outerRingMat.color.setHex(accentHex);
    outerRingMat.opacity = isLight ? 0.32 : 0.28;
    innerRingMat.color.setHex(isLight ? 0x4b7f8f : 0x7dd3fc);
    innerRingMat.opacity = isLight ? 0.24 : 0.2;

    floatingPlates.forEach((fp) => {
      const fMat = fp.frameMesh.material as THREE.MeshBasicMaterial;
      fMat.color.setHex(accentHex);
      fMat.opacity = isLight ? 0.36 : 0.32;
    });
  };

  setThemeAppearance(options.theme ?? 'dark', 0xd8f15a);

  const dispose = () => {
    disposableGeometries.forEach((g) => g.dispose());
    disposableMaterials.forEach((m) => m.dispose());
    disposableTextures.forEach((t) => t.dispose());
  };

  return {
    rootGroup,
    phoneBodyGroup,
    orbitalGroup,
    outerRing,
    innerRing,
    floatingPlates,
    screenUniforms,
    setThemeAppearance,
    dispose,
  };
}
