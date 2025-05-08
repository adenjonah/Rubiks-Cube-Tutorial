import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';
import { getFaceIndex, getColorFromState, COLORS, FACE_INDICES } from '../utils/cubeUtils';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Move notation and keyboard mappings
const MOVE_NOTATION = {
  'F': { key: 'f', description: 'Front face clockwise' },
  'B': { key: 'b', description: 'Back face clockwise' },
  'L': { key: 'l', description: 'Left face clockwise' },
  'R': { key: 'r', description: 'Right face clockwise' },
  'U': { key: 'u', description: 'Up face clockwise' },
  'D': { key: 'd', description: 'Down face clockwise' },
  'F\'': { key: 'F', description: 'Front face counterclockwise' },
  'B\'': { key: 'B', description: 'Back face counterclockwise' },
  'L\'': { key: 'L', description: 'Left face counterclockwise' },
  'R\'': { key: 'R', description: 'Right face counterclockwise' },
  'U\'': { key: 'U', description: 'Up face counterclockwise' },
  'D\'': { key: 'D', description: 'Down face counterclockwise' }
};

const RubiksCube3D = () => {
  const mountRef = useRef(null);
  const [cubeState, setCubeState] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [isRotating, setIsRotating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cubeGroupRef = useRef(null);
  const rotationGroupRef = useRef(null);
  const animationFrameRef = useRef(null);
  const cubePiecesRef = useRef({});

  // Initialize the scene and renderer
  useEffect(() => {
    if (!mountRef.current) return;
    
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f0);
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(3, 3, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);
    
    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    controlsRef.current = controls;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Create cube group
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    cubeGroupRef.current = cubeGroup;
    
    // Create rotation group
    const rotationGroup = new THREE.Group();
    scene.add(rotationGroup);
    rotationGroupRef.current = rotationGroup;
    
    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    // Handle window resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Create individual cube pieces
  const createCubes = () => {
    if (!cubeState || !cubeGroupRef.current) return;
    
    // Clear existing cubes
    while (cubeGroupRef.current.children.length > 0) {
      const child = cubeGroupRef.current.children[0];
      if (child.geometry) child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
      cubeGroupRef.current.remove(child);
    }
    
    cubePiecesRef.current = {};
    
    // Create 26 pieces (3x3x3 minus center)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip the internal piece
          if (x === 0 && y === 0 && z === 0) continue;
          
          const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
          const materials = [];
          
          // Right face (X+)
          const rightIdx = x === 1 ? getFaceIndex(x, y, z, 'right') : -1;
          materials.push(
            x === 1 
              ? new THREE.MeshPhongMaterial({ 
                  color: COLORS[getColorFromState(cubeState, FACE_INDICES.RIGHT, rightIdx)],
                  shininess: 30
                })
              : new THREE.MeshPhongMaterial({ color: COLORS.gray })
          );
          
          // Left face (X-)
          const leftIdx = x === -1 ? getFaceIndex(x, y, z, 'left') : -1;
          materials.push(
            x === -1 
              ? new THREE.MeshPhongMaterial({ 
                  color: COLORS[getColorFromState(cubeState, FACE_INDICES.LEFT, leftIdx)],
                  shininess: 30
                })
              : new THREE.MeshPhongMaterial({ color: COLORS.gray })
          );
          
          // Up face (Y+)
          const upIdx = y === 1 ? getFaceIndex(x, y, z, 'up') : -1;
          materials.push(
            y === 1 
              ? new THREE.MeshPhongMaterial({ 
                  color: COLORS[getColorFromState(cubeState, FACE_INDICES.UP, upIdx)],
                  shininess: 30
                })
              : new THREE.MeshPhongMaterial({ color: COLORS.gray })
          );
          
          // Down face (Y-)
          const downIdx = y === -1 ? getFaceIndex(x, y, z, 'down') : -1;
          materials.push(
            y === -1 
              ? new THREE.MeshPhongMaterial({ 
                  color: COLORS[getColorFromState(cubeState, FACE_INDICES.DOWN, downIdx)],
                  shininess: 30
                })
              : new THREE.MeshPhongMaterial({ color: COLORS.gray })
          );
          
          // Front face (Z+)
          const frontIdx = z === 1 ? getFaceIndex(x, y, z, 'front') : -1;
          materials.push(
            z === 1 
              ? new THREE.MeshPhongMaterial({ 
                  color: COLORS[getColorFromState(cubeState, FACE_INDICES.FRONT, frontIdx)],
                  shininess: 30
                })
              : new THREE.MeshPhongMaterial({ color: COLORS.gray })
          );
          
          // Back face (Z-)
          const backIdx = z === -1 ? getFaceIndex(x, y, z, 'back') : -1;
          materials.push(
            z === -1 
              ? new THREE.MeshPhongMaterial({ 
                  color: COLORS[getColorFromState(cubeState, FACE_INDICES.BACK, backIdx)],
                  shininess: 30
                })
              : new THREE.MeshPhongMaterial({ color: COLORS.gray })
          );
          
          const piece = new THREE.Mesh(geometry, materials);
          piece.position.set(x, y, z);
          piece.castShadow = true;
          piece.receiveShadow = true;
          
          // Store face indices in userData for reference
          piece.userData = {
            position: { x, y, z },
            indices: {
              right: rightIdx,
              left: leftIdx,
              up: upIdx,
              down: downIdx,
              front: frontIdx,
              back: backIdx
            }
          };
          
          cubeGroupRef.current.add(piece);
          
          // Store a reference to this piece
          const key = `${x},${y},${z}`;
          cubePiecesRef.current[key] = piece;
        }
      }
    }
  };
  
  // Get rotation axis for cube moves
  const getRotationAxis = (move) => {
    const face = move.charAt(0);
    
    switch (face) {
      case 'F': return new THREE.Vector3(0, 0, 1); // Front face - Z axis
      case 'B': return new THREE.Vector3(0, 0, -1); // Back face - Z axis
      case 'L': return new THREE.Vector3(-1, 0, 0); // Left face - X axis
      case 'R': return new THREE.Vector3(1, 0, 0); // Right face - X axis
      case 'U': return new THREE.Vector3(0, 1, 0); // Up face - Y axis
      case 'D': return new THREE.Vector3(0, -1, 0); // Down face - Y axis
      default: return new THREE.Vector3(0, 1, 0);
    }
  };
  
  // Animate a cube move
  const animateMove = (move) => {
    if (!cubeGroupRef.current || !sceneRef.current) return;
    
    const face = move.charAt(0);
    const isCounterClockwise = move.includes("'");
    const angle = isCounterClockwise ? -Math.PI/2 : Math.PI/2;
    const rotationAxis = getRotationAxis(move);
    
    // Get cubes to rotate based on the face
    const cubesToRotate = [];
    Object.entries(cubePiecesRef.current).forEach(([key, piece]) => {
      const { x, y, z } = piece.position;
      
      let shouldRotate = false;
      switch (face) {
        case 'F': shouldRotate = Math.abs(z - 1) < 0.1; break;
        case 'B': shouldRotate = Math.abs(z + 1) < 0.1; break;
        case 'L': shouldRotate = Math.abs(x + 1) < 0.1; break;
        case 'R': shouldRotate = Math.abs(x - 1) < 0.1; break;
        case 'U': shouldRotate = Math.abs(y - 1) < 0.1; break;
        case 'D': shouldRotate = Math.abs(y + 1) < 0.1; break;
        default: shouldRotate = false;
      }
      
      if (shouldRotate) {
        cubesToRotate.push(piece);
      }
    });
    
    // Clear the rotation group
    while (rotationGroupRef.current.children.length > 0) {
      rotationGroupRef.current.remove(rotationGroupRef.current.children[0]);
    }
    
    // Hide original pieces and add clones to the rotation group
    cubesToRotate.forEach(piece => {
      piece.visible = false;
      
      // Create a clone for animation
      const geometry = piece.geometry.clone();
      const materials = Array.isArray(piece.material) 
        ? piece.material.map(m => m.clone()) 
        : piece.material.clone();
      
      const clone = new THREE.Mesh(geometry, materials);
      clone.position.copy(piece.position);
      clone.rotation.copy(piece.rotation);
      clone.userData = { originalPiece: piece };
      
      rotationGroupRef.current.add(clone);
    });
    
    // Perform animation
    let startTime = null;
    const duration = 300; // milliseconds
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate rotation for this frame
      const rotation = progress * angle;
      rotationGroupRef.current.setRotationFromAxisAngle(rotationAxis, rotation);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        
        // Show original pieces
        cubesToRotate.forEach(piece => {
          piece.visible = true;
        });
        
        // Clean up rotation group
        while (rotationGroupRef.current.children.length > 0) {
          const clone = rotationGroupRef.current.children[0];
          if (clone.geometry) clone.geometry.dispose();
          if (Array.isArray(clone.material)) {
            clone.material.forEach(m => m.dispose());
          } else if (clone.material) {
            clone.material.dispose();
          }
          rotationGroupRef.current.remove(clone);
        }
        
        setIsRotating(false);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Fetch the initial cube state
  useEffect(() => {
    const fetchCubeState = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cube/state`, {
          withCredentials: true
        });
        
        if (response.data.cubeState) {
          setCubeState(response.data.cubeState);
        }
      } catch (error) {
        console.error('Error fetching cube state:', error);
        setErrorMessage('Failed to load cube state');
      }
    };
    
    fetchCubeState();
  }, []);
  
  // Update cube visualization when state changes
  useEffect(() => {
    if (cubeState) {
      createCubes();
    }
  }, [cubeState]);
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isRotating) return;
      
      const key = e.key;
      
      // Find the move that matches this key
      Object.entries(MOVE_NOTATION).forEach(([move, info]) => {
        if (info.key === key) {
          handleMove(move);
        }
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRotating]);
  
  // Handle a cube move
  const handleMove = async (move) => {
    if (isRotating) return;
    
    try {
      setIsRotating(true);
      
      // Start animation
      animateMove(move);
      
      // Send move to backend
      const response = await axios.post(`${API_BASE_URL}/api/cube/move`, {
        move,
        currentState: cubeState
      }, {
        withCredentials: true
      });
      
      // Update state after animation finishes
      setTimeout(() => {
        if (response.data.cubeState) {
          setCubeState(response.data.cubeState);
          setMoveHistory(prev => [...prev, move]);
        }
      }, 350);
    } catch (error) {
      console.error('Error making move:', error);
      setErrorMessage('Failed to make move');
      setIsRotating(false);
    }
  };
  
  // Handle cube reset
  const handleReset = async () => {
    if (isRotating) return;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/cube/reset`, {}, {
        withCredentials: true
      });
      
      if (response.data.cubeState) {
        setCubeState(response.data.cubeState);
        setMoveHistory([]);
      }
    } catch (error) {
      console.error('Error resetting cube:', error);
      setErrorMessage('Failed to reset cube');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
          {errorMessage}
        </div>
      )}
      
      <div 
        ref={mountRef} 
        className="relative mb-4 w-full h-[400px] border border-gray-200 rounded-lg shadow-lg"
      />
      
      <div className="controls mt-4 w-full max-w-md">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {Object.entries(MOVE_NOTATION).map(([move, info]) => (
            <button
              key={move}
              onClick={() => handleMove(move)}
              disabled={isRotating}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              title={info.description}
            >
              {move}
            </button>
          ))}
        </div>
        
        <button
          onClick={handleReset}
          disabled={isRotating}
          className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Reset Cube
        </button>
      </div>
      
      {moveHistory.length > 0 && (
        <div className="mt-4 w-full max-w-md">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Move History:</h3>
          <div className="text-xs bg-gray-100 p-2 rounded overflow-x-auto whitespace-nowrap">
            {moveHistory.join(' ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default RubiksCube3D; 