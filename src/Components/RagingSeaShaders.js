import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import dat from 'dat.gui';
import {waterVertexShader} from '../Shaders/WaterVertexShader';
import {waterFragmentShader} from '../Shaders/WaterFragmentShader';


const RagingSeaShaders = () => {

    const scene = new THREE.Scene();

    const canvas = document.querySelector('.webgl');

    const gui = new dat.GUI({ closed: true});
    const debugObject = {};

    const size = {
        width: window.innerWidth,
        height: window.innerHeight
    };


    const cursor = {
        x: 0,
        y: 0
    };

    window.addEventListener('mousemove', (event) => {
        cursor.x = event.clientX / size.width -0.5;
        cursor.y = event.clientY / size .height  -0.5;
    });

    /*
    * Textures
    */
    const textureLoader = new THREE.TextureLoader();

    // geometry
    const waterGeometry = new THREE.PlaneBufferGeometry(2, 2, 512, 512);


    // color
    // intially we have depthColor = '#0000ff' and surfaceColor = '#8888ff'.
    // after finding the rigth value using debug gui, we can change the values of color, uColorOffset, uColorOffsetMultiplier, etc
    debugObject.depthColor = '#186691';
    debugObject.surfaceColor = '#9bd8ff';


    // material 
    const waterMaterial = new THREE.ShaderMaterial({ 
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        uniforms:{
            uTime: { value: 0 },

            uBigWavesElevation: { value: 0.2 },
            uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
            uBigWavesSpeed: { value: 0.75 },
            
            uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
            uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
            
            // initially we have uColorOffset = 0.25 and uColorOffsetMultiplier = 2
            // after finding the rigth value using debug gui, we can change the values of color, uColorOffset, uColorOffsetMultiplier, etc
            uColorOffset: { value: 0.08 },
            uColorOffsetMultiplier: { value: 5},

            uSmallWavesElevation: { value: 0.15 },
            uSmallWavesFrequency: { value: 3 },
            uSmallWavesSpeed: { value: 0.2 },
            uSmallIterations: { value: 4 }
        }
     });

     // Debug gui
     gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
     gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX');
     gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY');
     gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(5).step(0.001).name('uBigWavesSpeed');
     
     gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation');
     gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency');
     gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed');
     gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(0.001).name('uSmallIterations');
     
     gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset');
     gui.add(waterMaterial.uniforms.uColorOffsetMultiplier, 'value').min(0).max(10).step(0.001).name('uColorOffsetMultiplier');
     gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.depthColor)});
     gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.surfaceColor)});


    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = - Math.PI * 0.5;
    scene.add(water);

    const camera = new THREE.PerspectiveCamera(70, size.width/size.height, 0.1, 100)
    camera.position.set(1.0, 1.0, 1.0);
    scene.add(camera);

    window.addEventListener('resize', () => {

        size.width = window.innerWidth;
        size.height = window.innerHeight;

        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();

        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });

    renderer.setSize(size.width, size.height);

    const clock = new THREE.Clock();
    let previousTime = 0;

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        //update water
        waterMaterial.uniforms.uTime.value = elapsedTime;

        controls.update();
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();

    return(
        <>
        </>
    );
};

export default RagingSeaShaders;