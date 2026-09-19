"use client";

import { useEffect, useRef, useState } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshBasicMaterial,
  Color,
  Mesh,
  Group,
  InstancedMesh,
  Matrix4,
  Raycaster,
  Vector2,
  TubeGeometry,
  CatmullRomCurve3,
  Vector3,
  CanvasTexture,
} from "three";
import { geoEquirectangular, geoPath } from "d3-geo";

/* ============================================================
   Helpers (same as Originkit originals, condensed)
   ============================================================ */

function latLngToPosition(lat: number, lng: number) {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  return {
    x: Math.cos(latRad) * Math.sin(lngRad),
    y: Math.sin(latRad),
    z: Math.cos(latRad) * Math.cos(lngRad),
  };
}

function mapLinear(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (inMax === inMin) return outMin;
  const t = (v - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function simplifyRing(ring: number[][], detail: number) {
  if (ring.length < 2) return ring;
  if (detail >= 10) return ring;
  const step = Math.max(1, Math.floor(mapLinear(detail, 1, 10, 10, 1)));
  const simplified = [ring[0]];
  for (let i = step; i < ring.length - 1; i += step) simplified.push(ring[Math.min(i, ring.length - 1)]);
  const last = ring[ring.length - 1];
  const first = ring[0];
  if (!(Math.abs(last[0] - first[0]) < 1e-4 && Math.abs(last[1] - first[1]) < 1e-4)) simplified.push(last);
  return simplified.length >= 2 ? simplified : ring;
}

/* ============================================================
   Component
   ============================================================ */

export default function GlobeThree() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const w = container.clientWidth || 400;
    const h = container.clientHeight || 400;

    // ── Scene ──
    const scene = new Scene();
    const camera = new PerspectiveCamera(45, w / h, 0.1, 100);
    const globeRadius = 1;
    camera.position.set(0, 0, 2.6);
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = "srgb";
    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 0.6s ease";
    container.appendChild(canvas);

    // ── Globe group ──
    const globeGroup = new Group();
    scene.add(globeGroup);

    // ── Outline ring ──
    {
      const ringPoints: Vector3[] = [];
      const segs = 128;
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        ringPoints.push(new Vector3(Math.cos(a) * globeRadius, Math.sin(a) * globeRadius, 0));
      }
      ringPoints.push(ringPoints[0].clone());
      const curve = new CatmullRomCurve3(ringPoints);
      const tube = new TubeGeometry(curve, ringPoints.length * 2, 0.008, 8, false);
      const mat = new MeshBasicMaterial({ color: new Color("#D4A017"), transparent: true, opacity: 0.4 });
      globeGroup.add(new Mesh(tube, mat));
    }

    // ── Graticule (thin lines) ──
    {
      const gridColor = new Color("#a8a29e");
      const gridMat = new MeshBasicMaterial({ color: gridColor, transparent: true, opacity: 0.08 });
      for (let lat = -90; lat <= 90; lat += 30) {
        const pts: Vector3[] = [];
        for (let i = 0; i <= 64; i++) {
          const lng = (i / 64) * 360 - 180;
          const p = latLngToPosition(lat, lng);
          pts.push(new Vector3(p.x * globeRadius, p.y * globeRadius, p.z * globeRadius));
        }
        if (pts.length >= 2) {
          const curve = new CatmullRomCurve3(pts);
          globeGroup.add(new Mesh(new TubeGeometry(curve, pts.length * 2, 0.003, 8, false), gridMat));
        }
      }
      for (let lng = -180; lng < 180; lng += 30) {
        const pts: Vector3[] = [];
        for (let i = 0; i <= 64; i++) {
          const lat = (i / 64) * 180 - 90;
          const p = latLngToPosition(lat, lng);
          pts.push(new Vector3(p.x * globeRadius, p.y * globeRadius, p.z * globeRadius));
        }
        if (pts.length >= 2) {
          const curve = new CatmullRomCurve3(pts);
          globeGroup.add(new Mesh(new TubeGeometry(curve, pts.length * 2, 0.003, 8, false), gridMat));
        }
      }
    }

    // ── Dots & outlines ──
    const loadGeo = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/50m/physical/ne_50m_land.json"
        );
        if (!res.ok) throw new Error("Failed to load");
        const land = await res.json();

        // Continent outlines
    const outlineMat = new MeshBasicMaterial({
      color: new Color("#D4A017"),
          transparent: true,
          opacity: 0.35,
          depthTest: true,
          depthWrite: true,
        });
        const projection = geoEquirectangular();
        const pathGen = geoPath().projection(projection);

        land.features.forEach((feature: any) => {
          const geom = feature.geometry;
          if (!geom?.coordinates) return;
          const processRing = (ring: number[][]) => {
            if (ring.length < 2) return;
            const simplified = simplifyRing(ring, 5);
            const positions: Vector3[] = [];
            simplified.forEach(([lng, lat]) => {
              const p = latLngToPosition(lat, lng);
              positions.push(new Vector3(p.x * globeRadius, p.y * globeRadius, p.z * globeRadius));
            });
            if (positions.length > 1) {
              positions.push(positions[0].clone());
              const curve = new CatmullRomCurve3(positions);
              globeGroup.add(
                new Mesh(
                  new TubeGeometry(curve, positions.length * 2, 0.004, 6, false),
                  outlineMat
                )
              );
            }
          };
          if (geom.type === "Polygon") processRing(geom.coordinates[0]);
          else if (geom.type === "MultiPolygon") {
            geom.coordinates.forEach((poly: number[][][]) => { if (poly[0]) processRing(poly[0]); });
          }
        });

        // Dot grid on land
        const bmpW = 1024, bmpH = 512;
        const offCvs = document.createElement("canvas");
        offCvs.width = bmpW; offCvs.height = bmpH;
        const ctx = offCvs.getContext("2d", { willReadFrequently: true })!;
        const proj = geoEquirectangular().fitSize([bmpW, bmpH], { type: "Sphere" } as any);
        const pg = geoPath().projection(proj).context(ctx);
        ctx.fillStyle = "#000"; ctx.fillRect(0, 0, bmpW, bmpH);
        ctx.fillStyle = "#fff"; ctx.beginPath();
        land.features.forEach((f: any) => pg(f));
        ctx.fill();
        const imgData = ctx.getImageData(0, 0, bmpW, bmpH);
        const pixels = imgData.data;

        const isOnLand = (lng: number, lat: number) => {
          const x = Math.round(((lng + 180) / 360) * bmpW) % bmpW;
          const y = Math.max(0, Math.min(bmpH - 1, Math.round(((90 - lat) / 180) * bmpH)));
          return pixels[(y * bmpW + x) * 4] > 128;
        };

        const coords: [number, number][] = [];
        const spacing = 0.6;
        for (let lat = -90; lat <= 90; lat += spacing) {
          const cosL = Math.cos((Math.abs(lat) * Math.PI) / 180);
          const lngStep = cosL > 0.01 ? spacing / Math.max(0.3, cosL) : 360;
          for (let lng = -180; lng < 180; lng += lngStep) {
            if (isOnLand(lng, lat)) coords.push([lng, lat]);
          }
        }

        if (coords.length > 0) {
          const dotGeom = new SphereGeometry(0.008, 4, 4);
          const dotMat = new MeshBasicMaterial({
            color: new Color("#D4A017"),
            transparent: true,
            opacity: 0.75,
          });
          const instanced = new InstancedMesh(dotGeom, dotMat, coords.length);
          const m = new Matrix4();
          coords.forEach(([lng, lat], i) => {
            const p = latLngToPosition(lat, lng);
            m.makeScale(1, 1, 1);
            m.setPosition(p.x * globeRadius, p.y * globeRadius, p.z * globeRadius);
            instanced.setMatrixAt(i, m);
          });
          instanced.instanceMatrix.needsUpdate = true;
          globeGroup.add(instanced);
        }

        canvas.style.opacity = "1";
        renderer.render(scene, camera);
      } catch {
        setGeoError("Failed to load map data");
      }
    };

    // ── Animation ──
    let af: number | null = null;
    let isDragging = false;
    let isHovering = false;
    let lastX = 0, lastY = 0;
    const rot = { x: 0, y: 0.05 };
    const target = { x: 0, y: 0.05 };
    const vel = { x: 0, y: 0 };
    const lerpF = 0.06;

    const animate = () => {
      if (!isDragging) target.x += 0.003;
      rot.x += (target.x - rot.x) * lerpF;
      rot.y += (target.y - rot.y) * lerpF;
      rot.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rot.y));
      globeGroup.rotation.y = rot.x;
      globeGroup.rotation.x = rot.y;
      renderer.render(scene, camera);
      af = requestAnimationFrame(animate);
    };

    loadGeo().then(() => {
      canvas.style.opacity = "1";
      af = requestAnimationFrame(animate);
    });

    // ── Drag ──
    const onDown = (e: MouseEvent) => {
      isDragging = true;
      vel.x = vel.y = 0;
      lastX = e.clientX; lastY = e.clientY;
    };
    const onMoveDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      const sens = 0.005;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      target.x += dx * sens;
      target.y += dy * sens;
      target.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, target.y));
      lastX = e.clientX; lastY = e.clientY;
    };
    const onUp = () => { isDragging = false; };
    canvas.addEventListener("mousedown", onDown);
    document.addEventListener("mousemove", onMoveDrag);
    document.addEventListener("mouseup", onUp);

    // ── Hover ──
    const raycaster = new Raycaster();
    const mouse = new Vector2();
    const dummySphere = new Mesh(new SphereGeometry(globeRadius, 8, 8));
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      isHovering = raycaster.intersectObject(dummySphere).length > 0;
    });

    // ── Resize ──
    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth || 400;
      const nh = container.clientHeight || 400;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(container);

    return () => {
      if (af) cancelAnimationFrame(af);
      canvas.removeEventListener("mousedown", onDown);
      document.removeEventListener("mousemove", onMoveDrag);
      document.removeEventListener("mouseup", onUp);
      ro.disconnect();
      renderer.dispose();
      container.removeChild(canvas);
    };
  }, []);

  if (geoError) return <div className="w-full h-full flex items-center justify-center text-warm-400 text-xs">{geoError}</div>;

  return <div ref={containerRef} className="w-full h-full" />;
}
