// Детальная 3D-карта маршрутов InterCargo (three.js)
// Рельеф — карта высот + запечённая отмывка; поверх — реки, трассы, регионы, города и маршруты.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import mapData from '@/data/russia-map.json';
import reliefUrl from '@/assets/map/relief.webp';
import heightUrl from '@/assets/map/height.png';

const ACCENT = new THREE.Color('#2DC071');
const ACCENT_2 = new THREE.Color('#3CC8D8');
const ROAD = new THREE.Color('#F2B84B');
const HEIGHT = 2.6; // высота самых высоких гор в единицах сцены
const HEIGHT_CURVE = 1.7; // низины почти плоские, горы поднимаются

const [EX0, EY0, EX1, EY1] = mapData.extent;
const EW = EX1 - EX0;
const EH = EY1 - EY0;

export const ROUTES = [
  ['msk', 'spb'], ['msk', 'kzn'], ['msk', 'krd'], ['msk', 'ekb'], ['msk', 'kgd'], ['spb', 'mur'],
  ['msk', 'nnv'], ['kzn', 'sam'], ['rnd', 'msk'], ['kzn', 'ekb'], ['ekb', 'oms'], ['oms', 'nsk'],
  ['nsk', 'kja'], ['kja', 'irk'], ['irk', 'yak'], ['irk', 'khv'], ['khv', 'vvo'], ['msk', 'vvo'],
  ['ekb', 'nsk'], ['spb', 'krd'], ['msk', 'arh'], ['vgg', 'ast'], ['ekb', 'tmn'], ['khv', 'mgd'],
];
export const FEATURED = [['msk', 'vvo'], ['spb', 'krd'], ['msk', 'ekb'], ['ekb', 'nsk'], ['msk', 'kzn'], ['khv', 'vvo'], ['msk', 'arh']];

const cityById = Object.fromEntries(mapData.cities.map((c) => [c.id, c]));

export function routeInfo(fromId, toId) {
  const a = cityById[fromId];
  const b = cityById[toId];
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2
    + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  const km = Math.round((2 * R * Math.asin(Math.sqrt(h)) * 1.25) / 10) * 10;
  return { from: a.name, to: b.name, km, days: Math.max(1, Math.round(km / 750)) };
}

// ─── Высоты на CPU (чтобы «положить» линии и города на рельеф) ───
async function loadHeightSampler() {
  const img = new Image();
  img.src = heightUrl;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const { data, width, height } = g.getImageData(0, 0, c.width, c.height);
  return (x, y) => {
    const u = ((x - EX0) / EW) * (width - 1);
    const v = ((EY1 - y) / EH) * (height - 1);
    const i = Math.max(0, Math.min(width - 1, Math.round(u)));
    const j = Math.max(0, Math.min(height - 1, Math.round(v)));
    return ((data[(j * width + i) * 4] / 255) ** HEIGHT_CURVE) * HEIGHT;
  };
}

const toWorld = (x, y, h) => new THREE.Vector3(x, h, -y);

function buildTerrain(relief, heightTex) {
  const geo = new THREE.PlaneGeometry(EW, EH, 520, 242);
  geo.rotateX(-Math.PI / 2);
  geo.translate((EX0 + EX1) / 2, 0, -(EY0 + EY1) / 2);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uMap: { value: relief },
      uHeight: { value: heightTex },
      uScale: { value: HEIGHT },
      uReveal: { value: 0 },
      uTime: { value: 0 },
      uAccent: { value: ACCENT },
    },
    vertexShader: /* glsl */ `
      uniform sampler2D uHeight;
      uniform float uScale;
      uniform float uReveal;
      varying vec2 vUv;
      varying float vH;
      void main() {
        vUv = uv;
        float h = pow(texture2D(uHeight, uv).r, 1.7);
        vH = h;
        vec3 p = position;
        p.y += h * uScale * smoothstep(0.0, 1.0, uReveal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform float uReveal;
      uniform float uTime;
      uniform vec3 uAccent;
      varying vec2 vUv;
      varying float vH;
      void main() {
        vec3 col = texture2D(uMap, vUv).rgb;
        // мягкое затухание к краям, чтобы карта «висела» в темноте
        vec2 d = (vUv - 0.5) * vec2(1.0, 1.15);
        float edge = smoothstep(0.55, 0.36, length(d));
        // проявление от центра
        float r = uReveal * 0.85;
        float reveal = smoothstep(r, r - 0.15, length(vUv - vec2(0.42, 0.5)));
        // сканирующая волна по высоким точкам
        float scan = smoothstep(0.02, 0.0, abs(fract(vUv.x * 1.0 - uTime * 0.05) - 0.5) - 0.48) * vH;
        col += uAccent * scan * 0.35;
        gl_FragColor = vec4(col * (0.35 + 0.65 * reveal), edge);
      }
    `,
  });
  return new THREE.Mesh(geo, material);
}

// Набор ломаных → один LineSegments, уложенный на рельеф
function buildLines(polylines, sample, { color, opacity, lift = 0.05, closed = false }) {
  const pos = [];
  for (const flat of polylines) {
    const n = flat.length / 2;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const x = flat[i * 2];
      const y = flat[i * 2 + 1];
      pts.push([x, sample(x, y) + lift, -y]);
    }
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      pos.push(...a, ...b);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  return new THREE.LineSegments(geo, mat);
}

function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(200,255,225,0.9)');
  grd.addColorStop(1, 'rgba(45,192,113,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildCity(city, sample) {
  const group = new THREE.Group();
  const ground = sample(city.x, city.y);
  group.position.copy(toWorld(city.x, city.y, ground + 0.04));
  const major = city.tier === 1;
  const height = major ? 3.6 : city.tier === 2 ? 1.6 : 0;

  let beamMat = null;
  if (height) {
    const beamGeo = new THREE.CylinderGeometry(0.06, 0.06, height, 8, 1, true);
    beamGeo.translate(0, height / 2, 0);
    beamMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color('#C9FFE0') }, uBoost: { value: 0 } },
      vertexShader: 'varying float vH; void main(){ vH = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 uColor; uniform float uBoost; varying float vH; void main(){ gl_FragColor = vec4(uColor, (1.0 - vH) * (0.5 + uBoost)); }',
    });
    group.add(new THREE.Mesh(beamGeo, beamMat));
  }

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(major ? 0.28 : city.tier === 2 ? 0.18 : 0.11, 12, 12),
    new THREE.MeshBasicMaterial({ color: major ? '#E9FFF2' : city.tier === 2 ? '#BDEFD3' : '#7FAF95' }),
  );
  core.position.y = 0.08;
  group.add(core);

  let ring = null;
  if (city.tier <= 2) {
    const ringGeo = new THREE.RingGeometry(0.36, 0.48, 40);
    ringGeo.rotateX(-Math.PI / 2);
    ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: ACCENT, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    ring.position.y = 0.05;
    group.add(ring);
  }

  group.userData = {
    city, ring, beamMat, core, phase: Math.random() * Math.PI * 2,
    labelAnchor: new THREE.Vector3(0, Math.max(height, 0.4) + 0.35, 0),
  };
  return group;
}

function buildRoute(from, to, index, sample) {
  const a = toWorld(from.x, from.y, sample(from.x, from.y) + 0.12);
  const b = toWorld(to.x, to.y, sample(to.x, to.y) + 0.12);
  const dist = a.distanceTo(b);
  const mid = a.clone().lerp(b, 0.5);
  mid.y = Math.max(a.y, b.y) + Math.min(1.6 + dist * 0.2, 11);
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  const geo = new THREE.TubeGeometry(curve, Math.max(24, Math.round(dist * 2.2)), 0.085, 6, false);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uHighlight: { value: 0 },
      uDim: { value: 0 },
      uOffset: { value: index * 0.37 },
      uLen: { value: dist },
      uColor: { value: ACCENT },
      uColor2: { value: ACCENT_2 },
    },
    vertexShader: 'varying float vT; void main(){ vT = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uReveal; uniform float uHighlight; uniform float uDim;
      uniform float uOffset; uniform float uLen; uniform vec3 uColor; uniform vec3 uColor2;
      varying float vT;
      void main() {
        if (vT > uReveal) discard;
        float dashes = fract(vT * uLen * 0.16 - uTime * 0.8 - uOffset);
        float flow = smoothstep(0.0, 0.25, dashes) * smoothstep(0.7, 0.25, dashes);
        float ends = smoothstep(0.0, 0.04, vT) * smoothstep(1.0, 0.96, vT);
        float glow = (0.2 + flow * 0.5) * (1.0 - uDim * 0.8) + uHighlight * (0.55 + flow * 1.3);
        gl_FragColor = vec4(mix(uColor, uColor2, vT) * (1.0 + uHighlight), glow * ends);
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.userData = { curve, material, from: from.id, to: to.id, speed: 0.04 + Math.random() * 0.05, t: Math.random() };
  return mesh;
}

export async function createRouteMap(container, { onFeatured, onLabels, onReady } = {}) {
  const width = () => container.clientWidth || 1;
  const height = () => container.clientHeight || 1;
  const isSmall = () => width() < 760;

  const loader = new THREE.TextureLoader();
  const [relief, heightTex, sample] = await Promise.all([
    loader.loadAsync(reliefUrl),
    loader.loadAsync(heightUrl),
    loadHeightSampler(),
  ]);
  relief.colorSpace = THREE.SRGBColorSpace;
  relief.anisotropy = 8;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(width(), height());
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.setClearColor(0x000000, 0);
  relief.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, width() / height(), 0.5, 600);
  const target = new THREE.Vector3(2, 0, 1);

  const world = new THREE.Group();
  scene.add(world);

  const terrain = buildTerrain(relief, heightTex);
  world.add(terrain);

  const layers = {
    regions: buildLines(mapData.regions, sample, { color: '#DFFBEA', opacity: 0.07, lift: 0.03 }),
    rivers: buildLines(mapData.rivers, sample, { color: ACCENT_2, opacity: 0.5, lift: 0.04 }),
    roads: buildLines(mapData.roads, sample, { color: ROAD, opacity: 0.42, lift: 0.06 }),
    outline: buildLines(mapData.polygons.map((p) => p[0]), sample, { color: ACCENT, opacity: 0.95, lift: 0.07, closed: true }),
  };
  Object.values(layers).forEach((l) => world.add(l));

  const cities = mapData.cities.map((c) => buildCity(c, sample));
  cities.forEach((c) => world.add(c));

  const routes = ROUTES.filter(([f, t]) => cityById[f] && cityById[t])
    .map(([f, t], i) => buildRoute(cityById[f], cityById[t], i, sample));
  routes.forEach((r) => world.add(r));

  const truckGeo = new THREE.BufferGeometry();
  const truckPos = new Float32Array(routes.length * 3);
  truckGeo.setAttribute('position', new THREE.BufferAttribute(truckPos, 3));
  const trucks = new THREE.Points(truckGeo, new THREE.PointsMaterial({
    size: 2.2, map: makeGlowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  world.add(trucks);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(width(), height()), 0.6, 0.45, 0.42);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ─── Камера: карта по центру, вписана по ширине ───
  const pointer = new THREE.Vector2();
  const smooth = new THREE.Vector2();
  let scrollK = 0;
  const onPointer = (e) => {
    const r = container.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onScroll = () => {
    const r = container.getBoundingClientRect();
    scrollK = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
  };
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  let viewShiftY = null;
  // Только в разработке: фиксированный ракурс для рендера картинок внутренних страниц
  let still = null;
  function placeStill() {
    const { x, z, dist, tilt, yaw } = still;
    target.set(x, 0, -z);
    if (viewShiftY !== 0) {
      viewShiftY = 0;
      camera.clearViewOffset();
    }
    const t = THREE.MathUtils.degToRad(tilt);
    const a = THREE.MathUtils.degToRad(yaw);
    camera.position.set(
      target.x + Math.sin(a) * Math.cos(t) * dist,
      target.y + Math.sin(t) * dist,
      target.z + Math.cos(a) * Math.cos(t) * dist,
    );
    camera.lookAt(target);
  }

  function placeCamera() {
    if (still) {
      placeStill();
      return;
    }
    const aspect = width() / height();
    const small = isSmall();
    // Карта опускается в нижнюю часть экрана — сверху остаётся место под заголовок
    const shiftY = small ? -0.24 : -0.19;
    if (shiftY !== viewShiftY) {
      viewShiftY = shiftY;
      camera.setViewOffset(width(), height(), 0, height() * shiftY, width(), height());
    }
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    const fitW = small ? 104 : Math.max(126, 150 - aspect * 14); // сколько единиц карты должно влезть по ширине
    const dist = (fitW / 2) / Math.tan(hfov / 2) * 0.86;
    const tilt = THREE.MathUtils.degToRad(44 + scrollK * 16);
    camera.position.set(
      target.x + smooth.x * 5,
      target.y + Math.sin(tilt) * dist - smooth.y * 2,
      target.z + Math.cos(tilt) * dist,
    );
    camera.lookAt(target.x + smooth.x * 1.5, target.y, target.z);
  }

  // Наведение на город
  const raycaster = new THREE.Raycaster();
  const hoverTargets = cities.map((c) => c.userData.core);
  let hoveredCity = null;
  const onMove = (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(hoverTargets, false)[0];
    hoveredCity = hit ? hit.object.parent.userData.city.id : null;
    renderer.domElement.style.cursor = hoveredCity ? 'pointer' : '';
  };
  renderer.domElement.addEventListener('pointermove', onMove);

  let featuredIndex = 0;
  let featuredAt = 0;
  const emitFeatured = () => {
    const [f, t] = FEATURED[featuredIndex % FEATURED.length];
    if (onFeatured) onFeatured(routeInfo(f, t));
  };
  emitFeatured();

  const clock = new THREE.Clock();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tmp = new THREE.Vector3();
  let raf = 0;
  let running = true;
  let reveal = 0;

  function frame() {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    reveal = reduceMotion ? 1 : Math.min(1, reveal + dt * 0.4);
    smooth.lerp(pointer, 0.04);
    world.rotation.y = still ? 0 : Math.sin(t * 0.07) * 0.025 + smooth.x * 0.03;
    placeCamera();

    terrain.material.uniforms.uReveal.value = reveal;
    terrain.material.uniforms.uTime.value = t;
    const fade = THREE.MathUtils.smoothstep(reveal, 0.35, 0.9);
    layers.regions.material.opacity = 0.07 * fade;
    layers.rivers.material.opacity = 0.5 * fade;
    layers.roads.material.opacity = 0.42 * fade;
    layers.outline.material.opacity = 0.95 * Math.min(1, reveal * 1.6);

    if (t - featuredAt > 4.5) {
      featuredAt = t;
      featuredIndex += 1;
      emitFeatured();
    }
    const [ff, ft] = FEATURED[featuredIndex % FEATURED.length];

    routes.forEach((r, i) => {
      const u = r.userData.material.uniforms;
      u.uTime.value = t;
      u.uReveal.value = Math.min(1, Math.max(0, reveal * 1.7 - 0.6 - i * 0.01));
      const featured = r.userData.from === ff && r.userData.to === ft;
      const touched = hoveredCity && (r.userData.from === hoveredCity || r.userData.to === hoveredCity);
      const goal = touched || (!hoveredCity && featured) ? 1 : 0;
      u.uHighlight.value += (goal - u.uHighlight.value) * 0.08;
      u.uDim.value += ((hoveredCity && !touched ? 1 : 0) - u.uDim.value) * 0.08;

      r.userData.t = (r.userData.t + dt * r.userData.speed * (reduceMotion ? 0 : 1)) % 1;
      r.userData.curve.getPoint(r.userData.t, tmp);
      const visible = u.uReveal.value >= r.userData.t;
      truckPos[i * 3] = tmp.x;
      truckPos[i * 3 + 1] = visible ? tmp.y + 0.05 : -999;
      truckPos[i * 3 + 2] = tmp.z;
    });
    truckGeo.attributes.position.needsUpdate = true;

    cities.forEach((c) => {
      const { ring, phase, beamMat, city } = c.userData;
      const active = hoveredCity === city.id || ff === city.id || ft === city.id;
      if (ring) {
        const k = ((t * 0.7 + phase) % 1.6) / 1.6;
        ring.scale.setScalar(1 + k * (city.tier === 1 ? 3.4 : 2));
        ring.material.opacity = (1 - k) * 0.8 * fade;
      }
      if (beamMat) beamMat.uniforms.uBoost.value += ((active ? 0.45 : 0) - beamMat.uniforms.uBoost.value) * 0.1;
    });

    if (onLabels) {
      const w = width();
      const h = height();
      onLabels(cities.map((c) => {
        c.localToWorld(tmp.copy(c.userData.labelAnchor));
        tmp.project(camera);
        const { city } = c.userData;
        return {
          id: city.id,
          name: city.name,
          tier: city.tier,
          x: (tmp.x * 0.5 + 0.5) * w,
          y: (-tmp.y * 0.5 + 0.5) * h,
          active: hoveredCity === city.id || ff === city.id || ft === city.id,
          visible: tmp.z < 1 && fade > 0.6,
        };
      }));
    }

    composer.render();
  }

  const resize = () => {
    renderer.setSize(width(), height());
    composer.setSize(width(), height());
    camera.aspect = width() / height();
    viewShiftY = null;
    placeCamera();
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const setRunning = (on) => {
    if (on === running) return;
    running = on;
    if (on) {
      clock.getDelta();
      frame();
    } else cancelAnimationFrame(raf);
  };
  const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting && !document.hidden), { threshold: 0.01 });
  io.observe(container);
  const onVisibility = () => setRunning(!document.hidden);
  document.addEventListener('visibilitychange', onVisibility);

  frame();
  if (import.meta.env.DEV) {
    window.__icMap = {
      setStill(view) { still = view; reveal = 1; },
    };
  }
  if (onReady) onReady();

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      renderer.domElement.removeEventListener('pointermove', onMove);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
        mats.forEach((m) => {
          Object.values(m.uniforms || {}).forEach((u) => u.value?.isTexture && u.value.dispose());
          if (m.map) m.map.dispose();
          m.dispose();
        });
      });
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
