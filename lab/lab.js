// // basic setting
// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
// camera.position.set(0, 15, 50);

// const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // antialias 反鋸齒
// renderer.setSize(innerWidth, innerHeight); 
// renderer.setPixelRatio(window.devicePixelRatio); //將像素比率設定跟螢幕的像素比率一樣 <就是比較清晰啦>
// renderer.toneMapping = THREE.ACESFilmicToneMapping;//降低對比 避免白色過曝 且保留細節
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.physicallyCorrectLights = true;
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFsoftShadowMap;
// document.body.appendChild(renderer.domElement);


// // add a moon light
// const moonLight = new THREE.DirectionalLight(
//   new THREE.Color("#77ccff").convertSRGBToLinear(),
//   0,
// );
// moonLight.position.set(-10, 20, 10);
// moonLight.castShadow = true;
// moonLight.shadow.mapSize.width = 512;
// moonLight.shadow.mapSize.height = 512;
// moonLight.shadow.camera.near = 0.5;
// moonLight.shadow.camera.far = 100;
// moonLight.shadow.camera.left = -10;
// moonLight.shadow.camera.bottom = -10;
// moonLight.shadow.camera.top = 10;
// moonLight.shadow.camera.right = 10;
// scene.add(moonLight);


// // controler
// const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.target.set(0,0,0);
// controls.dampingFactor = 0.05;
// controls.enableDamping = true;



// (async function () {
//     // HDR
//     let pmrem = new THREE.PMREMGenerator(renderer);
//     let envmapTexture = await new THREE.RGBELoader().loadAsync("../img/half earth.hdr");  
//     let envMap = pmrem.fromEquirectangular(envmapTexture).texture;



//     let textures = {
//         bump: await new THREE.TextureLoader().loadAsync("../img/earthbump.jpg"),
//         map: await new THREE.TextureLoader().loadAsync("../img/earthmap.jpg"),
//         spec: await new THREE.TextureLoader().loadAsync("../img/earthspec.jpg"),
//         planeTrailMask: await new THREE.TextureLoader().loadAsync("../img/mask.png"),
//     };

//   // make a earth
//     const earth = new THREE.Mesh(
//         new THREE.SphereGeometry(10, 70, 70),
//         new THREE.MeshPhysicalMaterial({
//             map: textures.map,
//             roughnessMap: textures.spec,
//             bumpMap: textures.bump,
//             bumpScale: 0.65,
//             envMap,
//             envMapIntensity: 0.1,
//             sheen: 1,
//             sheenRoughness: 1,
//             sheenColor: new THREE.Color("#4a1b87").convertSRGBToLinear(),
//             clearcoat: 0.5,

//         })
//     );
//     earth.receiveShadow = true;
//     scene.add(earth);

//     // add plane
//     let plane = (await new THREE.GLTFLoader().loadAsync("../img/plane/scene.glb")).scene.children[0];
//     let planesData = [
//         makePlane(plane, textures.planeTrailMask, envMap, scene),
//         makePlane(plane, textures.planeTrailMask, envMap, scene),
//         makePlane(plane, textures.planeTrailMask, envMap, scene),
//         makePlane(plane, textures.planeTrailMask, envMap, scene),
//         makePlane(plane, textures.planeTrailMask, envMap, scene),
//         makePlane(plane, textures.planeTrailMask, envMap, scene),
//     ];



//     let clock = new THREE.Clock();
//     renderer.setAnimationLoop(()=>{
//         let delta = clock.getDelta();
//         earth.rotation.y += delta * 0.05;

        

//         planesData.forEach(planeData => {
//             let plane = planeData.group;
          
//             plane.position.set(0,0,0);
//             plane.rotation.set(0,0,0);
//             plane.updateMatrixWorld();
         
//             planeData.rot += delta * 0.25;
//             plane.rotateOnAxis(planeData.randomAxis, planeData.randomAxisRot); // random axis
//             plane.rotateOnAxis(new THREE.Vector3(0, 1, 0), planeData.rot);    // y-axis rotation
//             plane.rotateOnAxis(new THREE.Vector3(0, 0, 1), planeData.rad);    // this decides the radius
//             plane.translateY(planeData.yOff);
//             plane.rotateOnAxis(new THREE.Vector3(1,0,0), +Math.PI * 0.5);
//           });



//         controls.update();
//         renderer.render(scene, camera);
//     });
// })();



// // make plans
// function makePlane(planeMesh, trailTexture, envMap, scene) {
//     let plane = planeMesh.clone();
//     plane.scale.set(0.001, 0.001, 0.001);
//     plane.position.set(0,0,0);
//     plane.rotation.set(0,0,0);
//     plane.updateMatrixWorld();
  
//     plane.traverse((object) => {
//       if(object instanceof THREE.Mesh) {
//         object.material.envMap = envMap;
//         object.sunEnvIntensity = 1;
//         object.moonEnvIntensity = 0.3;
//         object.castShadow = true;
//         object.receiveShadow = true;
//       }
//     });
    
//     let trail = new THREE.Mesh(
//         new THREE.PlaneGeometry(1, 2),
//         new THREE.MeshPhysicalMaterial({
//           envMap,
//           envMapIntensity: 3,

//           roughness: 0.4,
//           metalness: 0,
//           transmission: 1,
    
//           transparent: true,
//           opacity: 1,
//           alphaMap: trailTexture,
//         })
//       );
//       trail.sunEnvIntensity = 1;
//       trail.moonEnvIntensity = 0.7;
//       trail.rotateX(Math.PI);
//       trail.translateY(1.1);
    
//       let group = new THREE.Group();
//       group.add(plane);
//       group.add(trail);
    
//       scene.add(group);
  
//     return {
//         group,
//         yOff: 10.5 + Math.random() * 1.0,
//         rot: Math.PI * 2,  // just to set a random starting point
//         rad: Math.random() * Math.PI * 0.45 + Math.PI * 0.05,
//         randomAxis: new THREE.Vector3(nr(), nr(), nr()).normalize(),
//         randomAxisRot: Math.random() * Math.PI * 2,
//     };
//   }

//   function nr() {
//     return Math.random() * 2 - 1;
//   }


// basic setting
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0, 15, 50);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // antialias 反鋸齒
renderer.setSize(innerWidth, innerHeight); 
renderer.setPixelRatio(window.devicePixelRatio); //將像素比率設定跟螢幕的像素比率一樣 <就是比較清晰啦>
renderer.toneMapping = THREE.ACESFilmicToneMapping;//降低對比 避免白色過曝 且保留細節
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFsoftShadowMap;
document.body.appendChild(renderer.domElement);


// add a moon light
const moonLight = new THREE.DirectionalLight(
  new THREE.Color("#77ccff").convertSRGBToLinear(),
  0,
);
moonLight.position.set(-10, 20, 10);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 512;
moonLight.shadow.mapSize.height = 512;
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 100;
moonLight.shadow.camera.left = -10;
moonLight.shadow.camera.bottom = -10;
moonLight.shadow.camera.top = 10;
moonLight.shadow.camera.right = 10;
scene.add(moonLight);


// controler
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0,0,0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;



(async function () {
    // HDR
    let pmrem = new THREE.PMREMGenerator(renderer);
    let envmapTexture = await new THREE.RGBELoader().loadAsync("../img/half earth.hdr");  
    let envMap = pmrem.fromEquirectangular(envmapTexture).texture;



    let textures = {
        bump: await new THREE.TextureLoader().loadAsync("../img/earthbump.jpg"),
        map: await new THREE.TextureLoader().loadAsync("../img/earthmap.jpg"),
        spec: await new THREE.TextureLoader().loadAsync("../img/earthspec.jpg"),
        planeTrailMask: await new THREE.TextureLoader().loadAsync("../img/mask.png"),
    };

  // make a earth
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(20, 70, 70),
        new THREE.MeshPhysicalMaterial({
            map: textures.map,
            roughnessMap: textures.spec,
            bumpMap: textures.bump,
            bumpScale: 0.65,
            envMap,
            envMapIntensity: 0.08,
            sheen: 1,
            sheenRoughness: 1,
            sheenColor: new THREE.Color("#4a1b87").convertSRGBToLinear(),
            clearcoat: 0.5,

        })
    );
    earth.rotation.y += Math.PI * 1.25;
    earth.receiveShadow = true;
    scene.add(earth);

    // add plane
    let plane = (await new THREE.GLTFLoader().loadAsync("../img/plane/scene.glb")).scene.children[0];
    let planesData = [
        makePlane(plane, textures.planeTrailMask, envMap, scene),
        makePlane(plane, textures.planeTrailMask, envMap, scene),
        makePlane(plane, textures.planeTrailMask, envMap, scene),
        makePlane(plane, textures.planeTrailMask, envMap, scene),
        makePlane(plane, textures.planeTrailMask, envMap, scene),
        makePlane(plane, textures.planeTrailMask, envMap, scene),
    ];



    let clock = new THREE.Clock();
    renderer.setAnimationLoop(()=>{
        let delta = clock.getDelta();
        earth.rotation.y += delta * 0.05;

        

        planesData.forEach(planeData => {
            let plane = planeData.group;
          
            plane.position.set(0,0,0);
            plane.rotation.set(0,0,0);
            plane.updateMatrixWorld();
         
            planeData.rot += delta * 0.25;
            plane.rotateOnAxis(planeData.randomAxis, planeData.randomAxisRot); // random axis
            plane.rotateOnAxis(new THREE.Vector3(0, 1, 0), planeData.rot);    // y-axis rotation
            plane.rotateOnAxis(new THREE.Vector3(0, 0, 1), planeData.rad);    // this decides the radius
            plane.translateY(planeData.yOff);
            plane.rotateOnAxis(new THREE.Vector3(1,0,0), +Math.PI * 0.5);
          });



        controls.update();
        renderer.render(scene, camera);
    });
})();



// make plans
function makePlane(planeMesh, trailTexture, envMap, scene) {
    let plane = planeMesh.clone();
    plane.scale.set(0.001, 0.001, 0.001);
    plane.position.set(0,0,0);
    plane.rotation.set(0,0,0);
    plane.updateMatrixWorld();
  
    plane.traverse((object) => {
      if(object instanceof THREE.Mesh) {
        object.material.envMap = envMap;
        object.sunEnvIntensity = 1;
        object.moonEnvIntensity = 0.3;
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    
    let trail = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 2),
        new THREE.MeshPhysicalMaterial({
          envMap,
          envMapIntensity: 3,

          roughness: 0.4,
          metalness: 0,
          transmission: 1,
    
          transparent: true,
          opacity: 1,
          alphaMap: trailTexture,
        })
      );
      trail.sunEnvIntensity = 1;
      trail.moonEnvIntensity = 0.7;
      trail.rotateX(Math.PI);
      trail.translateY(1.1);
    
      let group = new THREE.Group();
      group.add(plane);
      group.add(trail);
    
      scene.add(group);
  
    return {
        group,
        yOff: 10.5 + Math.random() * 1.0,
        rot: Math.PI * 2,  // just to set a random starting point
        rad: Math.random() * Math.PI * 0.45 + Math.PI * 0.05,
        randomAxis: new THREE.Vector3(nr(), nr(), nr()).normalize(),
        randomAxisRot: Math.random() * Math.PI * 2,
    };
  }

  function nr() {
    return Math.random() * 2 - 1;
  }




