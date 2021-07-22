import React from 'react'
import * as THREE from 'three'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import earth_image from './earth_texture_map.jpg'

import './coffeeComposition.scss'


export default function ThreeJS() {
      /* ThreeJS stuff */
      const { useRef, useEffect, useState } = React
      const mount = useRef(null)
      const [isAnimating] = useState(true)
      const controls = useRef(null)

      useEffect(() => {
            let width = mount.current.clientWidth
            let height = mount.current.clientHeight
            let frameId

            const scene = new THREE.Scene()
            scene.rotateX(.2)
            const renderer = new THREE.WebGLRenderer({ antialias: true })

            
            //const mocha = new THREE.Mesh( geometry, material_mocha );
            //mocha.position.y = 1
            //scene.add(mocha)


            const composition = [
                  { name: 'mocha', color: 0x814E43, height: 5 },
                  { name: 'water', color: 0xCFF5FF, height: 5 },
                  { name: 'water2', color: 0xbbb, height: 5 },
            ]

            let stackingOffset = 0


            composition.forEach(comp => spawnCup(comp, comp.color, comp.height, comp.offset))

            function spawnCup (comp, color, height, offset) {
                  const geometry = new THREE.CylinderGeometry( 5, 5, height, 40, 10, true );
                  const material = new THREE.MeshToonMaterial({ color: color }); 

                  let result = new THREE.Mesh(geometry, material)

                  result.position.y = (height/2) + stackingOffset
                  
                  stackingOffset += height

                  result.receiveShadow = true

                  comp.mesh = result
                  comp.mesh.scale.set(1, 0, 1)
                  comp.mesh.loop = false

                  scene.add(comp.mesh)

                  console.log("added:", comp.mesh)
            }

            console.log(composition)


            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
            camera.position.z = 20
            camera.position.y = 10

            let pointLight;
            pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.set(60, -20, 80);
            pointLight.angle = Math.PI / 4;
            pointLight.penumbra = 0.1;
            pointLight.decay = 0;
            pointLight.distance = 200;
            pointLight.castShadow = true;
            pointLight.shadow.mapSize.width = 512;
            pointLight.shadow.mapSize.height = 512;
            pointLight.shadow.camera.near = 10;
            pointLight.shadow.camera.far = 200;
            pointLight.shadow.focus = 1;
            scene.add(pointLight);

            renderer.setClearColor('#fff')
            renderer.setSize(width, height)


            const animate = (time) => {
                  //cup.rotation.x += 0.01

                  if (composition[0].mesh.scale.y < 1) {
                        composition[0].mesh.scale.y += (time * 0.00002);
                        //omposition[0].mesh.position.y += 0.025;
                  }
                  else if (composition[1].mesh.scale.y < 1) {
                        composition[0].mesh.scale.y = 1
                        composition[1].mesh.scale.y += (time * 0.00002);
                  }



                  renderScene(time)
                  frameId = window.requestAnimationFrame(animate)
            }

            const start = () => {
                  if (!frameId) {
                        frameId = requestAnimationFrame(animate)
                  }
            }

            const stop = () => {
                  cancelAnimationFrame(frameId)
                  frameId = null
            }

            const renderScene = (time) => {

                  renderer.render(scene, camera)
            }

            const handleResize = () => {
                  width = mount.current.clientWidth
                  height = mount.current.clientHeight
                  renderer.setSize(width, height)
                  camera.aspect = width / height
                  camera.updateProjectionMatrix()
                  renderScene()
            }

            mount.current.appendChild(renderer.domElement)
            window.addEventListener('resize', handleResize)

            start()

            controls.current = { start }

            return () => {
                  stop()

                  window.removeEventListener('resize', handleResize)

                  //mount.current.removeChild(renderer.domElement)

                  //scene.remove(cup)
                  //geometry.dispose()
                  //material.dispose()
            }
      }, [])

      useEffect(() => {
            if (isAnimating)
                  controls.current.start()
            else
                  controls.current.stop()
      }, [isAnimating])


      /* /ThreeJS struff */


      return (
            <div className="transit">
                  <div className="threejs" ref={mount} />
            </div>
      );
}

