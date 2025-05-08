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
  const [debugMode, setDebugMode] = useState(false);

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
    scene.background = new THREE.Color(0xf0f0f0); // Lighter background for better contrast
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // Position camera to see red (front), blue (right), and white (up) faces
    camera.position.set(4, 3, 5); 
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
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
    
    // Enhanced lighting for better color visibility
    // Ambient light (soft overall illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Main directional light (simulates sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7); // Light coming from top-right-front
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.001; // Reduce shadow acne
    scene.add(directionalLight);
    
    // Additional fill light from opposite direction for better face visibility
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 0, -5); // Light from back-left
    scene.add(fillLight);
    
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
    
    // Set default view orientation
    const setDefaultView = () => {
      if (controlsRef.current) {
        // Set the camera to view the cube from an angle where red (front), 
        // blue (right), and white (up) faces are visible
        camera.position.set(4, 3, 5);
        camera.lookAt(0, 0, 0);
        controlsRef.current.update();
      }
    };
    
    // Set the default view after a short delay to ensure controls are initialized
    setTimeout(setDefaultView, 100);
    
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

  // Create individual cube pieces with updated debugging support
  const createCubes = () => {
    if (!cubeState || !cubeGroupRef.current) return;
    
    console.log("Creating cubes with state:", JSON.stringify(cubeState));
    
    // Debug check to ensure we have a valid state
    if (!Array.isArray(cubeState) || cubeState.length !== 6) {
      console.error("Invalid cube state structure in createCubes:", cubeState);
      return;
    }
    
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
          
          // Create materials with enhanced properties
          const createFaceMaterial = (isVisible, faceIndex, pieceIndex) => {
            if (isVisible) {
              const material = new THREE.MeshPhongMaterial({
                color: COLORS[getColorFromState(cubeState, faceIndex, pieceIndex)],
                shininess: 50,
                specular: 0x222222,
                emissive: 0x000000,
                flatShading: false
              });
              
              // If debug mode is on, add a texture with the index number
              if (debugMode && pieceIndex >= 0) {
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                const ctx = canvas.getContext('2d');
                
                // Fill with the same color
                const color = getColorFromState(cubeState, faceIndex, pieceIndex);
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, 128, 128);
                
                // Add index number
                ctx.fillStyle = 'black';
                ctx.font = 'bold 80px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(pieceIndex.toString(), 64, 64);
                
                const texture = new THREE.CanvasTexture(canvas);
                material.map = texture;
              }
              
              return material;
            } else {
              return new THREE.MeshPhongMaterial({
                color: COLORS.gray,
                shininess: 10,
                transparent: true,
                opacity: 0.95
              });
            }
          };
          
          // Right face (X+) - Blue
          const rightIdx = x === 1 ? getFaceIndex(x, y, z, 'right') : -1;
          materials.push(createFaceMaterial(x === 1, FACE_INDICES.RIGHT, rightIdx));
          
          // Left face (X-) - Green
          const leftIdx = x === -1 ? getFaceIndex(x, y, z, 'left') : -1;
          materials.push(createFaceMaterial(x === -1, FACE_INDICES.LEFT, leftIdx));
          
          // Up face (Y+) - White
          const upIdx = y === 1 ? getFaceIndex(x, y, z, 'up') : -1;
          materials.push(createFaceMaterial(y === 1, FACE_INDICES.UP, upIdx));
          
          // Down face (Y-) - Yellow
          const downIdx = y === -1 ? getFaceIndex(x, y, z, 'down') : -1;
          materials.push(createFaceMaterial(y === -1, FACE_INDICES.DOWN, downIdx));
          
          // Front face (Z+) - Red
          const frontIdx = z === 1 ? getFaceIndex(x, y, z, 'front') : -1;
          materials.push(createFaceMaterial(z === 1, FACE_INDICES.FRONT, frontIdx));
          
          // Back face (Z-) - Orange
          const backIdx = z === -1 ? getFaceIndex(x, y, z, 'back') : -1;
          materials.push(createFaceMaterial(z === -1, FACE_INDICES.BACK, backIdx));
          
          const piece = new THREE.Mesh(geometry, materials);
          piece.position.set(x, y, z);
          piece.castShadow = true;
          piece.receiveShadow = true;
          
          // Add a thin black edge around each cubelet
          const edgeGeometry = new THREE.EdgesGeometry(geometry);
          const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
          const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
          piece.add(edges);
          
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
  
  // Get rotation axis and direction for cube moves
  const getRotationAxisAndAngle = (move) => {
    const face = move.charAt(0);
    const isCounterClockwise = move.includes("'");
    
    // For each face, define the axis and correct rotation direction to match backend behavior
    switch (face) {
      case 'F': // Front face (Z+)
        // Front face rotations need to match backend 
        return {
          axis: new THREE.Vector3(0, 0, 1),
          angle: isCounterClockwise ? -Math.PI/2 : Math.PI/2
        };
      case 'B': // Back face (Z-)
        // Back face rotations need to match backend behavior
        return {
          axis: new THREE.Vector3(0, 0, -1),
          angle: isCounterClockwise ? -Math.PI/2 : Math.PI/2 
        };
      case 'L': // Left face (X-)
        return {
          axis: new THREE.Vector3(-1, 0, 0),
          angle: isCounterClockwise ? Math.PI/2 : -Math.PI/2
        };
      case 'R': // Right face (X+)
        return {
          axis: new THREE.Vector3(1, 0, 0),
          angle: isCounterClockwise ? -Math.PI/2 : Math.PI/2
        };
      case 'U': // Up face (Y+)
        return {
          axis: new THREE.Vector3(0, 1, 0),
          angle: isCounterClockwise ? -Math.PI/2 : Math.PI/2
        };
      case 'D': // Down face (Y-)
        return {
          axis: new THREE.Vector3(0, -1, 0),
          angle: isCounterClockwise ? Math.PI/2 : -Math.PI/2
        };
      default:
        return {
          axis: new THREE.Vector3(0, 1, 0),
          angle: Math.PI/2
        };
    }
  };
  
  // Animate a cube move
  const animateMove = (move) => {
    if (!cubeGroupRef.current || !sceneRef.current) return;
    
    const face = move.charAt(0);
    const { axis, angle } = getRotationAxisAndAngle(move);
    
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
      rotationGroupRef.current.setRotationFromAxisAngle(axis, rotation);
      
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
        console.log("Fetching initial cube state...");
        const response = await axios.get(`${API_BASE_URL}/api/cube/state`, {
          withCredentials: true
        });
        
        if (response.data.cubeState) {
          console.log("Initial cube state received:", JSON.stringify(response.data.cubeState));
          // Create a deep copy of the state to prevent reference issues
          const initialState = JSON.parse(JSON.stringify(response.data.cubeState));
          setCubeState(initialState);
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
      console.log("Creating cubes with state:", JSON.stringify(cubeState));
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
      
      // Create a deep copy of the current state to ensure we're using the correct state
      const currentCubeState = JSON.parse(JSON.stringify(cubeState));
      
      console.log(`Sending move ${move} to backend with current state:`, JSON.stringify(currentCubeState));
      const response = await axios.post(`${API_BASE_URL}/api/cube/move`, {
        move,
        currentState: currentCubeState
      }, {
        withCredentials: true
      });
      
      // Update state after animation finishes
      setTimeout(() => {
        if (response.data.cubeState) {
          console.log(`Received updated state after move ${move}:`, JSON.stringify(response.data.cubeState));
          
          // Get the state from the backend
          const newState = JSON.parse(JSON.stringify(response.data.cubeState));
          
          // Apply the new state directly
          if (Array.isArray(newState) && newState.length === 6) {
            console.log("Setting cube state to:", JSON.stringify(newState));
            setCubeState(newState);
            setMoveHistory(prev => [...prev, move]);
          } else {
            console.error("Invalid state received from backend:", newState);
            setErrorMessage("Invalid cube state received");
          }
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
        console.log("Reset cube state received:", JSON.stringify(response.data.cubeState));
        // Create a deep copy of the state to prevent reference issues
        const resetState = JSON.parse(JSON.stringify(response.data.cubeState));
        setCubeState(resetState);
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
      
      <div className="relative w-full">
        <div 
          ref={mountRef} 
          className="relative mb-4 w-full h-[400px] border border-gray-200 rounded-lg shadow-lg"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={() => {
              if (cameraRef.current && controlsRef.current) {
                cameraRef.current.position.set(4, 3, 5);
                cameraRef.current.lookAt(0, 0, 0);
                controlsRef.current.update();
              }
            }}
            className="px-2 py-1 bg-gray-800 text-white rounded text-xs"
          >
            Reset View
          </button>
          <button
            onClick={() => {
              setDebugMode(!debugMode);
              if (cubeState) {
                // Recreate cubes with debug info
                createCubes();
              }
            }}
            className={`px-2 py-1 ${debugMode ? 'bg-green-600' : 'bg-gray-600'} text-white rounded text-xs`}
          >
            {debugMode ? 'Debug: ON' : 'Debug: OFF'}
          </button>
        </div>
      </div>
      
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