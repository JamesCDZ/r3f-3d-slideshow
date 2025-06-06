import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei"; // ✅ Add this import
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { Overlay } from "./components/Overlay";

function App() {
  return (
    <>
      <Leva hidden />
      <Overlay />
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
    </>
  );
}

// ✅ Preload all models at app startup
useGLTF.preload("models/labnew.glb");
useGLTF.preload("models/controlnew.glb");
useGLTF.preload("models/connect.glb");

export default App;