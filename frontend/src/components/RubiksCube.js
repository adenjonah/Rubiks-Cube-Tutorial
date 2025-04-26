import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';
import { getFaceIndex } from '../utils/cubeUtils';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Standard Rubik's cube color scheme
const COLORS = {
  white: 0xffffff,  // Up
  yellow: 0xffff00, // Down
  red: 0xff0000,    // Front
  orange: 0xffa500, // Back
  blue: 0x0000ff,   // Right
  green: 0x00ff00   // Left
};

// Face indices mapping
const FACE_INDICES = {
  RIGHT: 0,  // Blue
  LEFT: 1,   // Green
  UP: 2,     // White
  DOWN: 3,   // Yellow
  FRONT: 4,  // Red
  BACK: 5    // Orange
};

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

const RubiksCube = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cubeGroupRef = useRef(null);
  const animationFrameRef = useRef(null);
  const rotationGroupRef = useRef(null);
  
  const [cubeState, setCubeState] = useState([
    Array(9).fill('blue'),    // Right
    Array(9).fill('green'),   // Left
    Array(9).fill('white'),   // Up
    Array(9).fill('yellow'),  // Down
    Array(9).fill('red'),     // Front
    Array(9).fill('orange')   // Back
  ]);
  // eslint-disable-next-line no-unused-vars
  const [lastMove, setLastMove] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [isRotating, setIsRotating] = useState(false);
  const [highlightedFace, setHighlightedFace] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Create an individual cube piece
  const createCubePiece = useCallback((x, y, z) => {
    if (!cubeGroupRef.current) return;
    
    const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
    
    // Calculate which faces of this piece are visible
    const isRightFace = x === 1;
    const isLeftFace = x === -1;
    const isUpFace = y === 1;
    const isDownFace = y === -1;
    const isFrontFace = z === 1;
    const isBackFace = z === -1;
    
    // Get face indices using the utility function
    const rightIdx = isRightFace ? getFaceIndex(x, y, z, 'right') : -1;
    const leftIdx = isLeftFace ? getFaceIndex(x, y, z, 'left') : -1;
    const upIdx = isUpFace ? getFaceIndex(x, y, z, 'up') : -1;
    const downIdx = isDownFace ? getFaceIndex(x, y, z, 'down') : -1;
    const frontIdx = isFrontFace ? getFaceIndex(x, y, z, 'front') : -1;
    const backIdx = isBackFace ? getFaceIndex(x, y, z, 'back') : -1;
    
    // Debug logs for extreme corners to verify indices
    if ((x === 1 && y === 1 && z === 1) || 
        (x === -1 && y === 1 && z === 1) ||
        (x === 1 && y === -1 && z === 1)) {
      console.log(`Piece at (${x},${y},${z}):`, {
        right: isRightFace ? `${rightIdx} (${cubeState[FACE_INDICES.RIGHT][rightIdx]})` : 'none',
        left: isLeftFace ? `${leftIdx} (${cubeState[FACE_INDICES.LEFT][leftIdx]})` : 'none',
        up: isUpFace ? `${upIdx} (${cubeState[FACE_INDICES.UP][upIdx]})` : 'none',
        down: isDownFace ? `${downIdx} (${cubeState[FACE_INDICES.DOWN][downIdx]})` : 'none',
        front: isFrontFace ? `${frontIdx} (${cubeState[FACE_INDICES.FRONT][frontIdx]})` : 'none',
        back: isBackFace ? `${backIdx} (${cubeState[FACE_INDICES.BACK][backIdx]})` : 'none'
      });
    }
    
    // Create materials for each face
    const materials = [];
    
    // Right face (X+)
    materials.push(isRightFace 
      ? new THREE.MeshPhongMaterial({ 
          color: COLORS[cubeState[FACE_INDICES.RIGHT][rightIdx]], 
          shininess: 30 
        })
      : new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    
    // Left face (X-)
    materials.push(isLeftFace 
      ? new THREE.MeshPhongMaterial({ 
          color: COLORS[cubeState[FACE_INDICES.LEFT][leftIdx]], 
          shininess: 30 
        })
      : new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    
    // Up face (Y+)
    materials.push(isUpFace 
      ? new THREE.MeshPhongMaterial({ 
          color: COLORS[cubeState[FACE_INDICES.UP][upIdx]], 
          shininess: 30 
        })
      : new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    
    // Down face (Y-)
    materials.push(isDownFace 
      ? new THREE.MeshPhongMaterial({ 
          color: COLORS[cubeState[FACE_INDICES.DOWN][downIdx]], 
          shininess: 30 
        })
      : new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    
    // Front face (Z+)
    materials.push(isFrontFace 
      ? new THREE.MeshPhongMaterial({ 
          color: COLORS[cubeState[FACE_INDICES.FRONT][frontIdx]], 
          shininess: 30 
        })
      : new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    
    // Back face (Z-)
    materials.push(isBackFace 
      ? new THREE.MeshPhongMaterial({ 
          color: COLORS[cubeState[FACE_INDICES.BACK][backIdx]], 
          shininess: 30 
        })
      : new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    
    const cube = new THREE.Mesh(geometry, materials);
    cube.position.set(x, y, z);
    
    // Store face info as custom properties
    cube.userData = {
      faces: {
        right: isRightFace ? { index: rightIdx, color: cubeState[FACE_INDICES.RIGHT][rightIdx] } : null,
        left: isLeftFace ? { index: leftIdx, color: cubeState[FACE_INDICES.LEFT][leftIdx] } : null,
        up: isUpFace ? { index: upIdx, color: cubeState[FACE_INDICES.UP][upIdx] } : null,
        down: isDownFace ? { index: downIdx, color: cubeState[FACE_INDICES.DOWN][downIdx] } : null,
        front: isFrontFace ? { index: frontIdx, color: cubeState[FACE_INDICES.FRONT][frontIdx] } : null,
        back: isBackFace ? { index: backIdx, color: cubeState[FACE_INDICES.BACK][backIdx] } : null
      },
      position: { x, y, z }
    };
    
    // Add shadow properties
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    // Add to cube group
    cubeGroupRef.current.add(cube);
    
    return cube;
  }, [cubeState]);

  // Render all cube pieces based on current state
  const renderCubes = useCallback(() => {
    if (!cubeGroupRef.current || !sceneRef.current) return;
    
    // Clear existing cubes
    while (cubeGroupRef.current.children.length > 0) {
      const child = cubeGroupRef.current.children[0];
      
      if (child.geometry) {
        child.geometry.dispose();
      }
      
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(material => material.dispose());
        } else {
          child.material.dispose();
        }
      }
      
      cubeGroupRef.current.remove(child);
    }
    
    // Create 27 small cubes (3x3x3)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip the center cube (internal)
          if (x === 0 && y === 0 && z === 0) continue;
          
          createCubePiece(x, y, z);
        }
      }
    }
  }, [createCubePiece]);

  // Get the correct rotation axis for a move
  const getRotationAxis = (move) => {
    const faceChar = move.charAt(0);
    
    switch (faceChar) {
      case 'F': // Front face - rotate around Z
        return new THREE.Vector3(0, 0, 1);
      case 'B': // Back face - rotate around Z
        return new THREE.Vector3(0, 0, -1);
      case 'L': // Left face - rotate around X
        return new THREE.Vector3(-1, 0, 0);
      case 'R': // Right face - rotate around X
        return new THREE.Vector3(1, 0, 0);
      case 'U': // Up face - rotate around Y
        return new THREE.Vector3(0, 1, 0);
      case 'D': // Down face - rotate around Y
        return new THREE.Vector3(0, -1, 0);
      default:
        return new THREE.Vector3(0, 0, 0);
    }
  };

  // Debug function to log current cube state
  const logCubeState = (label) => {
    console.log(`${label} - Cube State:`);
    const faceNames = ["Right (Blue)", "Left (Green)", "Up (White)", "Down (Yellow)", "Front (Red)", "Back (Orange)"];
    cubeState.forEach((face, i) => {
      console.log(`${faceNames[i]}: ${JSON.stringify(face)}`);
    });
  };

  // Helper function to update cube positions in world space
  const updateCubePositions = useCallback((rotationGroup, axis, angle) => {
    // Create matrix for the rotation
    const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
    
    rotationGroup.children.forEach(cube => {
      // Apply rotation to the cube's position vector
      const pos = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
      pos.applyMatrix4(rotationMatrix);
      
      // Round to fix floating point errors and keep on grid
      cube.position.set(
        Math.round(pos.x), 
        Math.round(pos.y), 
        Math.round(pos.z)
      );
      
      // Update userData position as well
      cube.userData.position = {
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        z: Math.round(pos.z)
      };
    });
  }, []);

  // Animate the cube rotation
  const animateCubeRotation = useCallback((move) => {
    if (!cubeGroupRef.current || !sceneRef.current) return;
    
    console.log(`Starting animation for move: ${move}`);
    logCubeState("Before animation");
    
    const faceChar = move.charAt(0);
    const isCounterClockwise = move.includes("'");
    const rotationAmount = isCounterClockwise ? -Math.PI/2 : Math.PI/2;
    
    // Create a rotation group if it doesn't exist
    if (!rotationGroupRef.current) {
      rotationGroupRef.current = new THREE.Group();
      sceneRef.current.add(rotationGroupRef.current);
    }
    
    const rotationGroup = rotationGroupRef.current;
    
    // Clear any previous children
    while (rotationGroup.children.length > 0) {
      rotationGroup.remove(rotationGroup.children[0]);
    }
    
    // Get all cubes that belong to the face being rotated
    const cubesToRotate = [];
    
    cubeGroupRef.current.children.forEach(cube => {
      const { x, y, z } = cube.position;
      
      let shouldRotate = false;
      
      // Select cubes based on the face
      switch (faceChar) {
        case 'F': // Front face (Z=1)
          shouldRotate = Math.abs(z - 1) < 0.1;
          break;
        case 'B': // Back face (Z=-1)
          shouldRotate = Math.abs(z + 1) < 0.1;
          break;
        case 'L': // Left face (X=-1)
          shouldRotate = Math.abs(x + 1) < 0.1;
          break;
        case 'R': // Right face (X=1)
          shouldRotate = Math.abs(x - 1) < 0.1;
          break;
        case 'U': // Up face (Y=1)
          shouldRotate = Math.abs(y - 1) < 0.1;
          break;
        case 'D': // Down face (Y=-1)
          shouldRotate = Math.abs(y + 1) < 0.1;
          break;
        default:
          shouldRotate = false;
          break;
      }
      
      if (shouldRotate) {
        // Debug which cubes are being rotated
        console.log(`Rotating cube at (${x}, ${y}, ${z}) for move ${move}`);
        console.log(`This cube has faces:`, cube.userData.faces);
        cubesToRotate.push(cube);
      }
    });
    
    console.log(`Found ${cubesToRotate.length} cubes to rotate`);
    
    // Save original cubes for later restoration
    const originalCubes = cubesToRotate.map(cube => ({
      cube,
      visible: cube.visible,
      position: cube.position.clone(),
      userData: JSON.parse(JSON.stringify(cube.userData))
    }));
    
    // Add cubes to rotation group
    cubesToRotate.forEach(cube => {
      // Hide original cube
      cube.visible = false;
      
      // Clone the cube
      const geometry = cube.geometry.clone();
      const materials = Array.isArray(cube.material) 
        ? cube.material.map(mat => mat.clone())
        : cube.material.clone();
      
      const clonedCube = new THREE.Mesh(geometry, materials);
      clonedCube.position.copy(cube.position);
      clonedCube.rotation.copy(cube.rotation);
      clonedCube.scale.copy(cube.scale);
      
      // Deep copy of userData
      clonedCube.userData = JSON.parse(JSON.stringify(cube.userData));
      
      // Keep reference to original cube for easier cleanup
      clonedCube.userData.originalCube = cube;
      
      // Add cloned cube to rotation group
      rotationGroup.add(clonedCube);
    });
    
    // Set rotation axis based on the face
    const rotationAxis = getRotationAxis(move);
    
    console.log(`Rotation axis for ${move}: (${rotationAxis.x}, ${rotationAxis.y}, ${rotationAxis.z})`);
    console.log(`Rotation amount: ${rotationAmount} radians (${isCounterClockwise ? 'counterclockwise' : 'clockwise'})`);
    
    // Perform animation
    let startTime = null;
    const duration = 300; // milliseconds
    
    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);
      
      // Calculate rotation for this frame
      const rotation = progress * rotationAmount;
      rotationGroup.setRotationFromAxisAngle(rotationAxis, rotation);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        // Calculate final positions for the cubes
        updateCubePositions(rotationGroup, rotationAxis, rotationAmount);
        
        // Show original cubes and update their positions
        rotationGroup.children.forEach(clonedCube => {
          const originalCube = clonedCube.userData.originalCube;
          if (originalCube) {
            // Update original cube's position
            originalCube.position.copy(clonedCube.position);
            
            // Update userData with new position
            originalCube.userData.position = {
              x: Math.round(clonedCube.position.x),
              y: Math.round(clonedCube.position.y),
              z: Math.round(clonedCube.position.z)
            };
            
            // Make original cube visible again
            originalCube.visible = true;
          }
          
          // Dispose of materials and geometry
          if (clonedCube.geometry) clonedCube.geometry.dispose();
          if (Array.isArray(clonedCube.material)) {
            clonedCube.material.forEach(mat => mat.dispose());
          } else if (clonedCube.material) {
            clonedCube.material.dispose();
          }
        });
        
        // Clear rotation group
        while (rotationGroup.children.length > 0) {
          rotationGroup.remove(rotationGroup.children[0]);
        }
        
        console.log(`Animation complete for move: ${move}`);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateCubePositions]);

  // Handle cube move
  const handleMove = useCallback(async (move) => {
    if (isRotating) return;
    
    try {
      console.log(`Making move: ${move}`);
      setIsRotating(true);
      setHighlightedFace(move.replace("'", ""));
      
      // Start rotation animation
      animateCubeRotation(move);
      
      // Send move to backend
      console.log(`Sending move to backend: ${move}`);
      const response = await axios.post(`${API_BASE_URL}/api/cube/move`, { move }, {
        withCredentials: true // Important for cookies/session
      });
      
      console.log(`Backend response:`, response.data);
      logCubeState("Current state");
      
      // Check if the state changed
      if (!response.data.cubeState || 
          JSON.stringify(response.data.cubeState) === JSON.stringify(cubeState)) {
        console.error("Warning: Cube state did not change after move!");
      }
      
      console.log(`New state from backend:`, response.data.cubeState);
      
      // Update state after delay to allow animation to complete
      setTimeout(() => {
        // Use the state directly from the backend response
        if (response.data.cubeState) {
          setCubeState(response.data.cubeState);
        }
        setLastMove(move);
        setMoveHistory(prev => [...prev, move]);
        setIsRotating(false);
        setHighlightedFace(null);
        
        console.log(`State updated after move: ${move}`);
        logCubeState("After state update");
      }, 300);
    } catch (error) {
      console.error('Error making move:', error);
      setIsRotating(false);
      setHighlightedFace(null);
    }
  }, [isRotating, animateCubeRotation]);

  // Initialize scene and cube
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Fetch initial cube state
    const fetchInitialState = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cube/state`, {
          withCredentials: true
        });
        
        if (response.data.cubeState) {
          console.log("Fetched initial cube state from server:", response.data.cubeState);
          setCubeState(response.data.cubeState);
        }
      } catch (error) {
        console.error("Failed to fetch initial cube state:", error);
      }
    };

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 3, 5);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    renderer.setClearColor(0xf0f0f0);
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Controls
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
      const width = window.innerWidth * 0.8;
      const height = window.innerHeight * 0.8;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Log initial cube state
    console.log(`Initial cube state:`);
    logCubeState("Initial state");
    
    // Fetch initial state from server
    fetchInitialState();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      mount.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, []);
  
  // Update cube visualization when state changes
  useEffect(() => {
    renderCubes();
  }, [cubeState, renderCubes]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isRotating) return; // Prevent moves while rotating
      
      const key = e.key;
      console.log(`Key pressed: ${key}`);
      
      // Find the move based on the key pressed
      Object.entries(MOVE_NOTATION).forEach(([move, info]) => {
        if (info.key === key) {
          console.log(`Key "${key}" maps to move: ${move}`);
          handleMove(move);
        }
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRotating, handleMove]);

  // Scramble the cube
  const handleScramble = async () => {
    if (isRotating) return;
    
    const moves = ['F', 'B', 'L', 'R', 'U', 'D', 'F\'', 'B\'', 'L\'', 'R\'', 'U\'', 'D\''];
    const scrambleSequence = Array(20).fill().map(() => moves[Math.floor(Math.random() * moves.length)]);
    
    console.log(`Scrambling with sequence: ${scrambleSequence.join(', ')}`);
    setMoveHistory([]);
    
    for (let i = 0; i < scrambleSequence.length; i++) {
      // Using await to ensure moves happen sequentially
      await new Promise(resolve => {
        setTimeout(async () => {
          await handleMove(scrambleSequence[i]);
          resolve();
        }, 350); // Slightly longer than the animation duration
      });
    }
  };
  
  // Reset the cube to solved state
  const handleReset = async () => {
    if (isRotating) return;
    
    try {
      console.log(`Resetting cube to solved state`);
      setIsRotating(true);
      
      const response = await axios.post(`${API_BASE_URL}/api/cube/reset`, {}, {
        withCredentials: true
      });
      setCubeState(response.data.cubeState);
      setMoveHistory([]);
      setLastMove(null);
      
      setTimeout(() => {
        setIsRotating(false);
        console.log(`Cube reset complete`);
        logCubeState("After reset");
      }, 300);
    } catch (error) {
      console.error('Error resetting cube:', error);
      setIsRotating(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={mountRef} 
        className="relative mb-4 w-4/5 h-[60vh] border border-gray-200 rounded-lg shadow-lg" 
      />
      
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {Object.entries(MOVE_NOTATION).map(([move, info]) => (
          <button
            key={move}
            onClick={() => handleMove(move)}
            disabled={isRotating}
            className={`
              px-3 py-2 rounded-md text-sm font-medium
              ${highlightedFace === move.replace("'", "") ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
              ${isRotating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}
            `}
            title={info.description}
          >
            {move}
          </button>
        ))}
      </div>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleScramble}
          disabled={isRotating}
          className={`
            px-4 py-2 rounded-md bg-yellow-500 text-white font-medium
            ${isRotating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}
          `}
        >
          Scramble
        </button>
        
        <button
          onClick={handleReset}
          disabled={isRotating}
          className={`
            px-4 py-2 rounded-md bg-green-500 text-white font-medium
            ${isRotating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}
          `}
        >
          Reset
        </button>
      </div>
      
      {moveHistory.length > 0 && (
        <div className="mb-4 max-w-md">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Move History:</h3>
          <div className="text-xs bg-gray-100 p-2 rounded overflow-x-auto whitespace-nowrap">
            {moveHistory.join(' ')}
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-600 mb-4">
        <p>Use the buttons above or keyboard keys to make moves.</p>
        <p>Lowercase letters (f, b, l, r, u, d) for clockwise rotation.</p>
        <p>Uppercase letters (F, B, L, R, U, D) for counterclockwise rotation.</p>
      </div>
    </div>
  );
};

export default RubiksCube; 