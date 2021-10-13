import React from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'

import earth_normalMap from './normalMaps/2k_earth_normal_map.png'

const textureLoader = new THREE.TextureLoader()
const earthMap = textureLoader.load(earth_normalMap)

export default function Scene(props) {
    const { useEffect } = React
    const { mount, planetList, controls } = props
    const { animating } = props.settings

    planetList.find((x) => x.id == 3).normalMap = earthMap

    /* ThreeJS Hook */
    useEffect(() => {
        let width = mount.current.clientWidth
        let height = mount.current.clientHeight
        let frameId

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000,
        )
        camera.position.z = 2
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.shadowMapEnabled = true
        renderer.shadowMap = THREE.BasicShadowMap
        const gui = new dat.GUI()

        const basePlanetRadius = 1
        const widthSegment = 100
        const heightSegment = 100
        const defaultSize = [basePlanetRadius, widthSegment, heightSegment]

        const geometry = new THREE.SphereGeometry(...defaultSize)
        const material = new THREE.MeshStandardMaterial()
        let planet = new THREE.Mesh(geometry, material)
        planet.material.side = THREE.DoubleSide
        planet.receiveShadow = true
        let loadedPlanet = null

        //#region Planet clouds
        const cloudGeometry = new THREE.SphereGeometry(...defaultSize)
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: null,
            opacity: 1,
            transparent: true,
            specular: new THREE.Color('white'),
        })
        cloudMaterial.color.setHSL(1, 1, 1)
        let planetClouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
        planetClouds.receiveShadow = true
        planetClouds.name = 'planetClouds'
        //#endregion

        scene.add(planet, camera)
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
        const sun = planetList.find((x) => x.id == 0)
        const additionalSunLights = []
        const pointLightSunLeft = pointLight.clone()
        const pointLightSunTop = pointLight.clone()
        const pointLightSunBottom = pointLight.clone()
        pointLightSunLeft.position.set(-(sun.scale * 2), 0, sun.scale * 2)
        pointLightSunTop.position.set(0, sun.scale * 2, sun.scale * 2)
        pointLightSunBottom.position.set(0, -(sun.scale * 2), sun.scale * 2)
        additionalSunLights.push(
            pointLightSunLeft,
            pointLightSunTop,
            pointLightSunBottom,
        )

        //const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
        //scene.add(pointLightHelper)

        // Generate stars
        var stars = []
        function getRandom() {
            var num = Math.floor(Math.random() * 10) + 1
            num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1
            return num
        }
        function getRandomZ() {
            // Only spawn stars behind the planet
            var num = Math.random() * 10 - 10
            return num
        }
        for (let i = 0; i < 800; i++) {
            let geometry = new THREE.PlaneGeometry(0.01, 0.01)
            let material = new THREE.MeshBasicMaterial({ color: 0xffffff })
            let star = new THREE.Mesh(geometry, material)
            star.position.set(getRandom(), getRandom(), getRandomZ())
            star.material.side = THREE.DoubleSide
            star.material.depthTest = false
            star.renderOrder = -1
            stars.push(star)
        }
        for (let j = 0; j < stars.length; j++) {
            scene.add(stars[j])
        }

        // GUI
        gui.add(pointLight.position, 'x').min(-100).max(200).step(10)
        gui.add(pointLight.position, 'y').min(-100).max(200).step(10)
        gui.add(pointLight.position, 'z').min(-100).max(200).step(10)

        // Default rotation
        planet.rotation.x += 0.45
        planet.rotation.y += 10

        let defaultRotateSpeed = 0.001
        let defaultCloudsRotateSpeedX = 0.00001
        let defaultCloudsRotateSpeedY = -0.0002 // Negative speed to "lag behind" planet rotation
        let rotateSpeed = defaultRotateSpeed

        const animate = () => {
            //planet.rotation.x += 0.01
            planet.rotation.y += rotateSpeed

            planetClouds.rotation.x += defaultCloudsRotateSpeedX
            planetClouds.rotation.y +=
                defaultRotateSpeed + defaultCloudsRotateSpeedY

            /* Stars animation */
            for (let k = 0; k < stars.length; k++) {
                let star = stars[k]
                star.rotation.x += 0.01
                star.rotation.y += 0.01
            }

            renderScene()
            frameId = window.requestAnimationFrame(animate)
        }

        const start = () => {
            if (!frameId) frameId = requestAnimationFrame(animate)
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

        const toggleLighting = (_lighting) => {
            if (_lighting) scene.add(pointLight)
            else scene.remove(pointLight)
        }

        // const toggleDistance = (_distance) => (camera.position.z = _distance)
        const toggleDistance = (_distance) => {
            planet.position.z = -_distance

            let _planetClouds = scene.getObjectByName('planetClouds')
            if (_planetClouds) _planetClouds.position.z = -_distance

            let _planetRing = scene.getObjectByName('planetRing')
            if (_planetRing) _planetRing.position.z = -_distance
        }

        let manualDistance = false
        const toggleManualDistance = (_manualDistance) => {
            manualDistance = _manualDistance
        }

        let defaultCamperaPosition = 2
        let baseRotationSpeen = 0.001
        const togglePlanet = (_planet) => {
            pointLight.position.z = _planet.scale * 2
            pointLight.position.x = _planet.scale * 2

            loadedPlanet = _planet

            if (_planet.id == 0)
                additionalSunLights.forEach((light) => scene.add(light))
            else additionalSunLights?.forEach((light) => scene.remove(light))

            // if (manualDistance == false)
            //     camera.position.z = defaultCamperaPosition * _planet.scale
            if (manualDistance == false)
                planet.position.z = 0 - _planet.scale * 2

            let planetRotationHours = _planet.rotationScale
            let rotationSpeed = planetRotationHours * baseRotationSpeen
            rotateSpeed = rotationSpeed

            if (_planet.scale) {
                planet.scale.x = basePlanetRadius * _planet.scale
                planet.scale.y = basePlanetRadius * _planet.scale
                planet.scale.z = basePlanetRadius * _planet.scale
            }

            if (_planet.image)
                material.map = THREE.ImageUtils.loadTexture(_planet.image)

            if (_planet.clouds) {
                planetClouds.scale.x = basePlanetRadius * _planet.clouds.scale
                planetClouds.scale.y = basePlanetRadius * _planet.clouds.scale
                planetClouds.scale.z = basePlanetRadius * _planet.clouds.scale
                cloudMaterial.map = THREE.ImageUtils.loadTexture(
                    _planet.clouds.image,
                )
                planetClouds.position.z = planet.position.z
                scene.add(planetClouds)
            } else scene.remove(planetClouds)

            if (_planet.ring) {
                //#region Planet ring
                let planetRingGeometry = new THREE.RingGeometry(
                    _planet.scale * _planet.ring.scaleInnerRadius,
                    _planet.scale * _planet.ring.scaleOuterRadius,
                    100,
                    100,
                    50,
                    Math.PI * 2,
                )
                const planetRingMaterial = new THREE.MeshPhongMaterial({
                    map: null,
                    opacity: 0.8,
                    transparent: true,
                    specular: new THREE.Color('white'),
                })
                planetRingMaterial.side = THREE.DoubleSide
                var planetRing = new THREE.Mesh(
                    planetRingGeometry,
                    planetRingMaterial,
                )

                planetRing.rotateX(1.8)

                planetRing.receiveShadow = true
                planetRing.name = 'planetRing'
                //#endregion

                planetRing.position.z = 0 - _planet.scale * 2
                planetRingMaterial.map = THREE.ImageUtils.loadTexture(
                    _planet.ring.image,
                )
                // console.log(planetRingGeometry.attributes)
                scene.add(planetRing)
            } else {
                let planetRing = scene.getObjectByName('planetRing')
                if (planetRing) scene.remove(planetRing)
            }
        }

        mount.current.appendChild(renderer.domElement)
        window.addEventListener('resize', handleResize)

        //toggleLighting()
        start()

        controls.current = {
            start,
            toggleLighting,
            toggleDistance,
            toggleManualDistance,
            togglePlanet,
        }

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
        if (animating) {
            console.log('is animating.. starting..', controls.current.start)
            controls.current.start()
        } else {
            console.log('is not animating.. stopping..')
            controls.current.stop()
        }
    }, [animating])

    return <div className="threejs" ref={mount} />
}
