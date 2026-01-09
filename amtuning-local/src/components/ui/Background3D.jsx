import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../contexts/ThemeContext';

// Subtle Floating Particles - Luxury Gold Dust Effect
const Particles = ({ themeColors }) => {
    const particlesRef = useRef();
    const particleCount = 600; // Reduced for elegance

    const [particles] = useState(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            velocities.push({
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.003,
                z: (Math.random() - 0.5) * 0.002
            });

            // Luxury gold tones
            const colorIndex = Math.floor(Math.random() * themeColors.length);
            const themeColor = themeColors[colorIndex];
            const hexColor = new THREE.Color(themeColor);
            colors[i * 3] = hexColor.r;
            colors[i * 3 + 1] = hexColor.g;
            colors[i * 3 + 2] = hexColor.b;
        }

        return { positions, velocities, colors };
    });

    useFrame((state) => {
        const positions = particlesRef.current.geometry.attributes.position.array;
        const time = state.clock.getElapsedTime();

        for (let i = 0; i < particleCount; i++) {
            // Gentle drift
            positions[i * 3] += particles.velocities[i].x;
            positions[i * 3 + 1] += Math.sin(time * 0.2 + i * 0.1) * 0.001 + particles.velocities[i].y;
            positions[i * 3 + 2] += particles.velocities[i].z;

            // Boundary wrap
            if (positions[i * 3] > 25) positions[i * 3] = -25;
            if (positions[i * 3] < -25) positions[i * 3] = 25;
            if (positions[i * 3 + 1] > 18) positions[i * 3 + 1] = -18;
            if (positions[i * 3 + 1] < -18) positions[i * 3 + 1] = 18;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={particles.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                vertexColors
                transparent
                opacity={0.25}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// Subtle Wave Field - Premium Gradient
const WaveField = ({ waveColor1, waveColor2 }) => {
    const meshRef = useRef();

    const shaderArgs = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
            uColorLow: { value: new THREE.Vector3(...waveColor1) },
            uColorHigh: { value: new THREE.Vector3(...waveColor2) }
        },
        vertexShader: `
            uniform float uTime;
            varying vec2 vUv;
            varying float vElevation;

            void main() {
                vUv = uv;
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);

                // Gentle, subtle wave pattern
                float elevation = sin(modelPosition.x * 0.8 + uTime * 0.15) *
                                  sin(modelPosition.z * 0.6 + uTime * 0.1) * 0.15;
                elevation += sin(modelPosition.x * 0.3 + uTime * 0.2) *
                            cos(modelPosition.z * 0.4 + uTime * 0.15) * 0.1;

                modelPosition.y += elevation;
                vElevation = elevation;

                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectionPosition = projectionMatrix * viewPosition;
                gl_Position = projectionPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 uColorLow;
            uniform vec3 uColorHigh;
            varying float vElevation;
            varying vec2 vUv;

            void main() {
                float mixStrength = (vElevation + 0.25) * 1.5;
                vec3 color = mix(uColorLow, uColorHigh, mixStrength);
                float alpha = 0.03 + abs(vElevation) * 0.08;
                gl_FragColor = vec4(color, alpha);
            }
        `
    }), [waveColor1, waveColor2]);

    useFrame((state) => {
        const { clock } = state;
        meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -5, 0]}>
            <planeGeometry args={[40, 40, 100, 100]} />
            <shaderMaterial
                args={[shaderArgs]}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

// Premium Background Images with Elegant Transition
const RotatingBackgroundImages = () => {
    const backgroundImages = [
        '/images/backgrounds/vsspeed-studio-m4.jpg',
        '/images/backgrounds/vsspeed-sunset-m4.jpg',
        '/images/backgrounds/vsspeed-track-m3.jpg',
        '/images/backgrounds/vsspeed-carbon-parts.jpg',
        '/images/backgrounds/vsspeed-worldwide-delivery.jpg'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
                setNextIndex((prev) => (prev + 1) % backgroundImages.length);
                setIsTransitioning(false);
            }, 2000);
        }, 45000); // 45 seconds - slower, more luxurious

        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${backgroundImages[currentIndex]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: isTransitioning ? 0 : 0.15,
                    transition: 'opacity 2s ease-in-out',
                    filter: 'brightness(0.4) contrast(1.1) saturate(0.8)',
                    zIndex: 1
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${backgroundImages[nextIndex]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: isTransitioning ? 0.15 : 0,
                    transition: 'opacity 2s ease-in-out',
                    filter: 'brightness(0.4) contrast(1.1) saturate(0.8)',
                    zIndex: 1
                }}
            />
            {/* Luxury gradient overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0.95) 100%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                }}
            />
        </>
    );
};

const Background3D = () => {
    const { currentTheme } = useTheme();

    if (!currentTheme) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.9
        }}>
            <RotatingBackgroundImages />
            <Canvas camera={{ position: [0, 5, 15], fov: 45 }} style={{ position: 'relative', zIndex: 3 }}>
                <color attach="background" args={['transparent']} />
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.5} color={currentTheme.secondary} />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color={currentTheme.primary} />

                <WaveField waveColor1={currentTheme.waveColor1} waveColor2={currentTheme.waveColor2} />
                <Particles themeColors={currentTheme.particleColors} />
            </Canvas>
        </div>
    );
};

export default Background3D;
