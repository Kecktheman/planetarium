import React from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import './Planetarium.scss'
import Moon from './Moon'

import sun_image from './textureMaps/2k_sun.jpg'
import mercury_image from './textureMaps/mercury_texture_map.jpg'
import venus_image from './textureMaps/venus_texture_map.jpg'
import earth_image from './textureMaps/2k_earth_daymap.jpg'
import mars_image from './textureMaps/mars_texture_map.jpg'
import jupiter_image from './textureMaps/jupiter_texture_map.jpg'
import saturn_image from './textureMaps/saturn_texture_map.jpg'
import uranus_image from './textureMaps/uranus_texture_map.jpg'
import neptune_image from './textureMaps/neptune_texture_map.jpg'

import earth_normalMap from './normalMaps/2k_earth_normal_map.png'
import earth_cloudMap from './textureMaps/2k_earth_clouds4.png'

const textureLoader = new THREE.TextureLoader()
const earthMap = textureLoader.load(earth_normalMap)

export default function ThreeJS() {
     /* ThreeJS stuff */
     const { useRef, useEffect, useState } = React
     const mount = useRef(null)
     const [isAnimating] = useState(true)
     const [isLighting, setLighting] = useState(true)
     const [isPlanet, setPlanet] = useState(3);
     const [isManualDistance, setManualDistance] = useState(false);
     const [isDistance, setDistance] = useState(2);
     
     const controls = useRef(null)

     const planetList = [
          { id: 0, name: 'Sun', scale: 109, rotationScale: 1, image: sun_image },
          { id: 1, name: 'Mercury', scale: 0.383, rotationScale: 58.646, image: mercury_image },
          { id: 2, name: 'Venus', scale: 0.949, rotationScale: 243.018, image: venus_image },
          {
               id: 3, name: 'Earth', scale: 1, rotationScale: 1, image: earth_image, normalMap: earthMap,
               clouds: {
                    scale: 1.005,
                    image: earth_cloudMap
               }
          },
          { id: 4, name: 'Mars', scale: 0.532, rotationScale: 1.026, image: mars_image },
          { id: 5, name: 'Jupiter', scale: 11.21, rotationScale: 0.41354, image: jupiter_image },
          { id: 6, name: 'Saturn', scale: 9.45, rotationScale: 0.444, image: saturn_image },
          { id: 7, name: 'Uranus', scale: 4.01, rotationScale: 0.718, image: uranus_image },
          { id: 8, name: 'Neptune', scale: 3.88, rotationScale: 0.671, image: neptune_image }
     ]

     /* Moon */
     const [isMoonShow, setMoonShow] = useState(false);
     const [isControlsShow, setControlsShow] = useState(false);

     /* ThreeJS Hook */
     useEffect(() => {
          let width = mount.current.clientWidth
          let height = mount.current.clientHeight
          let frameId

          const scene = new THREE.Scene()
          const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
          const renderer = new THREE.WebGLRenderer({ antialias: true })
          //const gui = new dat.GUI()

          const basePlanetRadius = 1
          const widthSegment = 100
          const heightSegment = 100
          const defaultSize = [basePlanetRadius, widthSegment, heightSegment];

          const geometry = new THREE.SphereGeometry(...defaultSize)
          const material = new THREE.MeshStandardMaterial()
          let planet = new THREE.Mesh(geometry, material)
          planet.material.side = THREE.DoubleSide
          planet.receiveShadow = true

          const cloudGeometry = new THREE.SphereGeometry(...defaultSize)
          const cloudMaterial = new THREE.MeshPhongMaterial({
               map: null,
               opacity: .65,
               transparent: true
          })
          cloudMaterial.color.setHSL(0, 0, 1)
          let planetClouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
          planetClouds.receiveShadow = true


          scene.add(planet, planetClouds, camera)

          renderer.setClearColor('#141414')
          renderer.setSize(width, height)

          // Main "sun"-light
          const pointLight = new THREE.PointLight(0xffffff, 1)
          pointLight.position.set(10, 0, 10)
          pointLight.angle = Math.PI / 4
          pointLight.penumbra = 0.1
          pointLight.decay = 0
          pointLight.distance = 1000
          pointLight.castShadow = true
          pointLight.shadow.mapSize.width = 512
          pointLight.shadow.mapSize.height = 512
          pointLight.shadow.camera.near = 10
          pointLight.shadow.camera.far = 1000
          pointLight.shadow.focus = 1

          // Additional lighting for Sun since the sun should emit light
          const sun = planetList.find(x => x.id == 0)
          const additionalSunLights = []
          const pointLightSunLeft = pointLight.clone()
          const pointLightSunTop = pointLight.clone()
          const pointLightSunBottom = pointLight.clone()
          pointLightSunLeft.position.set(-(sun.scale * 2), 0, (sun.scale * 2))
          pointLightSunTop.position.set(0, (sun.scale * 2), (sun.scale * 2))
          pointLightSunBottom.position.set(0, -(sun.scale * 2), (sun.scale * 2))
          additionalSunLights.push(pointLightSunLeft, pointLightSunTop, pointLightSunBottom)

          //const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
          //scene.add(pointLightHelper)

          // Generate stars
          var stars = [];
          function getRandom() {
               var num = Math.floor(Math.random() * 10) + 1;
               num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
               return num;
          }
          function getRandomZ() { // Only spawn stars behind the planet
               var num = Math.floor(Math.random() * 10) - 10;
               return num;
          }
          for (let i = 0; i < 250; i++) {
               let geometry = new THREE.PlaneGeometry(0.02, 0.02);
               let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
               let star = new THREE.Mesh(geometry, material);
               star.position.set(getRandom(), getRandom(), getRandomZ());
               star.material.side = THREE.DoubleSide;
               stars.push(star);
          }
          for (let j = 0; j < stars.length; j++) {
               scene.add(stars[j]);
          }

          // GUI
          // gui.add(pointLight.position, 'x').min(-100).max(250).step(0.01)
          // gui.add(pointLight.position, 'y').min(-100).max(250).step(0.01)
          // gui.add(pointLight.position, 'z').min(-100).max(250).step(0.01)


          // Default rotation
          planet.rotation.x += .45
          planet.rotation.y += 10

          let defaultRotateSpeed = 0.001

          let defaultCloudsRotateSpeedX = 0.00001
          let defaultCloudsRotateSpeedY = -0.0002 // Negative speed to "lag behind" planet rotation

          let rotateSpeed = defaultRotateSpeed;

          const animate = () => {
               //planet.rotation.x += 0.01
               planet.rotation.y += rotateSpeed

               planetClouds.rotation.x += defaultCloudsRotateSpeedX
               planetClouds.rotation.y += defaultRotateSpeed + defaultCloudsRotateSpeedY

               /* Stars animation */
               for (let k = 0; k < stars.length; k++) {
                    let star = stars[k];
                    star.rotation.x += 0.01;
                    star.rotation.y += 0.01;
               }

               renderScene()
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

          const renderScene = () => {
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

          const toggleLighting = (_isLighting) => {
               if (_isLighting)
                    scene.add(pointLight)
               else
                    scene.remove(pointLight)
          }

          const toggleDistance = (_isDistance) => { camera.position.z = _isDistance }
          let manualDistance = false
          const toggleManualDistance = (_manualDistance) => { manualDistance = _manualDistance }

          let defaultCamperaPosition = 2
          let baseRotationSpeen = 0.001
          const togglePlanet = (_planet) => {

               pointLight.position.z = (_planet.scale * 2)
               pointLight.position.x = (_planet.scale * 2)

               if (_planet.id == 0)
                    additionalSunLights.forEach(light => scene.add(light))
               else
                    additionalSunLights?.forEach(light => scene.remove(light))

               if (manualDistance == false)
                    camera.position.z = (defaultCamperaPosition * _planet.scale)                   

               let planetRotationHours = _planet.rotationScale
               let rotationSpeed = planetRotationHours * baseRotationSpeen
               rotateSpeed = rotationSpeed

               if (_planet.scale) {
                    planet.scale.x = basePlanetRadius * _planet.scale;
                    planet.scale.y = basePlanetRadius * _planet.scale;
                    planet.scale.z = basePlanetRadius * _planet.scale;
               }

               if (_planet.image)
                    material.map = THREE.ImageUtils.loadTexture(_planet.image)

               if (_planet.clouds) {
                    planetClouds.scale.x = basePlanetRadius * _planet.clouds.scale;
                    planetClouds.scale.y = basePlanetRadius * _planet.clouds.scale;
                    planetClouds.scale.z = basePlanetRadius * _planet.clouds.scale;
                    cloudMaterial.map = THREE.ImageUtils.loadTexture(_planet.clouds.image)
                    scene.add(planetClouds)
               }
               else
                    scene.remove(planetClouds)
          }

          mount.current.appendChild(renderer.domElement)
          window.addEventListener('resize', handleResize)

          //toggleLighting()
          start()

          controls.current = { start, toggleLighting, toggleDistance, toggleManualDistance, togglePlanet }

          return () => {
               stop()

               window.removeEventListener('resize', handleResize)

               //mount.current.removeChild(renderer.domElement)

               scene.remove(planet)
               geometry.dispose()
               material.dispose()
          }
     }, [])

     useEffect(() => {
          if (isAnimating)
               controls.current.start()
          else
               controls.current.stop()
     }, [isAnimating])

     useEffect(() => {
          controls.current.toggleLighting(isLighting)
     }, [isLighting])

     useEffect(() => {
          controls.current.toggleDistance(isDistance)
     }, [isDistance])

     useEffect(() => {
          controls.current.toggleManualDistance(isManualDistance)
     }, [isManualDistance])

     useEffect(() => {
          controls.current.togglePlanet(planetList.find(p => p.id == isPlanet))
     }, [isPlanet])

     /* /ThreeJS struff */

     const toggleMoonShow = () => { setMoonShow(!isMoonShow) }
     const toggleDistance = (value) => { setDistance(value) }
     const toggleManualDistance = () => { setManualDistance(!isManualDistance) }
     const toggleSelectPlanet = (event) => { setPlanet(event.target.value) }

     const ControlsModal = () => {
          return (
               <div className="modal is-active">
                    <div className="modal-card">
                         <header className="modal-card-head">
                              <p className="modal-card-title">Render controls</p>
                              <button className="icon" aria-label="down" onClick={() => setControlsShow(!isControlsShow)}>

                                   {isControlsShow ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleUp} />}

                              </button>
                         </header>
                         <section className={isControlsShow ? 'modal-card-body' : 'modal-card-body py-0 hide'}>
                              <form>
                                   <div className="field">
                                        <label className="label checkbox">
                                             Display sunlight
                                                      <input type="checkbox" defaultChecked={isLighting} onClick={() => setLighting(!isLighting)} />
                                        </label>
                                   </div>

                                   {/* <div className="field">
                                        <label className="label checkbox">
                                             Display realistic distance
                                                      <input type="checkbox" defaultChecked={isManualDistance} onClick={() => setManualDistance(!isManualDistance)} />
                                        </label>
                                   </div> */}

                                   <div className="field">
                                        <label className="label checkbox">
                                             Disaply moon
                                                      <input type="checkbox" defaultChecked={isMoonShow} onClick={toggleMoonShow} />
                                        </label>
                                   </div>

                                   <div className="field">
                                        <label className="label checkbox">
                                             Manual distance
                                                      <input type="checkbox" defaultChecked={isManualDistance} onClick={toggleManualDistance} />
                                        </label>
                                   </div>

                                   <div className="field">
                                        <label className="label">Set distance</label>
                                        <div className="field has-addons">
                                             <p className="control">
                                                  <a className="button" onClick={e => toggleDistance(isDistance - 1)}>
                                                       -
                                                  </a>
                                             </p>
                                             <p className="control">
                                                  <    input className="input small" type="text" value={isDistance} readOnly onChange={e => e.preventDefault()} />
                                             </p>
                                             <p className="control">
                                                  <a className="button" onClick={e => toggleDistance(isDistance + 1)}>
                                                       +
                                                  </a>
                                             </p>
                                        </div>
                                   </div>


                                   <div className="field">
                                        <label className="label">Display planet</label>
                                        <div className="control">
                                             <div className="select">
                                                  <select value={isPlanet} onChange={toggleSelectPlanet}>
                                                       {planetList.map(planet => (
                                                            <option value={planet.id} key={planet.id}>{planet.name}</option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </div>
                                   </div>
                              </form>
                         </section>
                    </div>
               </div>

          )
     }

     return (
          <div className="transit">
               <div className="threejs" ref={mount} />

               <div className="refrence-link">
                    <h4>Distance reference: <a href="https://www.youtube.com/watch?v=Z6DpPQ8QdLg">https://www.youtube.com/watch?v=Z6DpPQ8QdLg</a></h4>

                    <h4>Texture resources: <a href="https://www.solarsystemscope.com/textures/">https://www.solarsystemscope.com/textures/</a></h4>
               </div>

               <div className={isMoonShow ? '' : 'hide-moon'}>
                    <Moon></Moon>
               </div>

               <ControlsModal></ControlsModal>
          </div>
     );
}

