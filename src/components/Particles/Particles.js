import React, { useCallback } from 'react';
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import './Particles.css';
import particlesOptions from "./Particles.json";

function ParticlesEffect() {
    const particlesInit = useCallback(main => {
        loadFull(main);
    }, [])
    return (
            <Particles options={particlesOptions} init={particlesInit}/>
            );
}

export default ParticlesEffect;