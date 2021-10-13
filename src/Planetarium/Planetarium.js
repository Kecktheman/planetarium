import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import './Planetarium.scss'
import Moon from './Moon'
import Scene from './Scene'

import planetList from './planetList'

export default function ThreeJS() {
    const { useRef, useEffect, useState } = React
    const [animating] = useState(true)
    const [lighting, setLighting] = useState(true)
    const [planet, setPlanet] = useState(6)
    const [manualDistance, setManualDistance] = useState(false)
    const [distance, setDistance] = useState(0)

    const mount = useRef(null)
    const controls = useRef(null)

    /* Moon */
    const [isMoonShow, setMoonShow] = useState(false)
    const [isControlsShow, setControlsShow] = useState(false)

    useEffect(() => {
        if (animating) controls.current.start()
        else controls.current.stop()
    }, [animating])

    useEffect(() => {
        controls.current.toggleLighting(lighting)
    }, [lighting])

    useEffect(() => {
        controls.current.toggleDistance(distance)
    }, [distance])

    useEffect(() => {
        controls.current.toggleManualDistance(manualDistance)
    }, [manualDistance])

    useEffect(() => {
        controls.current.togglePlanet(planetList.find((p) => p.id == planet))
    }, [planet])

    const toggleMoonShow = () => {
        setMoonShow(!isMoonShow)
    }
    const toggleDistance = (value) => {
        setDistance(parseInt(value))
    }
    const toggleManualDistance = () => {
        setManualDistance(!manualDistance)
    }
    const toggleSelectPlanet = (event) => {
        setPlanet(event.target.value)
    }

    const ControlsModal = React.memo(() => {
        return (
            <div className="modal is-active">
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Render controls</p>
                        <button
                            className="icon"
                            aria-label="down"
                            onClick={() => setControlsShow(!isControlsShow)}
                        >
                            {isControlsShow ? (
                                <FontAwesomeIcon icon={faAngleDown} />
                            ) : (
                                <FontAwesomeIcon icon={faAngleUp} />
                            )}
                        </button>
                    </header>
                    <section
                        className={
                            isControlsShow
                                ? 'modal-card-body'
                                : 'modal-card-body py-0 hide'
                        }
                    >
                        <form>
                            <div className="field">
                                <label className="label checkbox">
                                    Display sunlight
                                    <input
                                        type="checkbox"
                                        defaultChecked={lighting}
                                        onClick={() => setLighting(!lighting)}
                                    />
                                </label>
                            </div>

                            <div className="field">
                                <label className="label checkbox">
                                    Disaply moon
                                    <input
                                        type="checkbox"
                                        defaultChecked={isMoonShow}
                                        onClick={toggleMoonShow}
                                    />
                                </label>
                            </div>

                            <div className="field">
                                <label className="label checkbox">
                                    Static distance
                                    <input
                                        type="checkbox"
                                        defaultChecked={manualDistance}
                                        onClick={toggleManualDistance}
                                    />
                                </label>
                            </div>
                            <br />
                            <div className="field">
                                <label className="label">
                                    Distance increment
                                </label>
                                <div className="field has-addons flex-has-even-content">
                                    <p className="control">
                                        <a
                                            className="button"
                                            onClick={(e) =>
                                                toggleDistance(distance - 10)
                                            }
                                        >
                                            -10
                                        </a>
                                    </p>
                                    <p className="control">
                                        <a
                                            className="button"
                                            onClick={(e) =>
                                                toggleDistance(distance - 1)
                                            }
                                        >
                                            -1
                                        </a>
                                    </p>
                                    <p className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            value={distance}
                                            readOnly
                                            onChange={(e) => e.preventDefault()}
                                        />
                                    </p>
                                    <p className="control">
                                        <a
                                            className="button"
                                            onClick={(e) =>
                                                toggleDistance(distance + 1)
                                            }
                                        >
                                            +1
                                        </a>
                                    </p>
                                    <p className="control">
                                        <a
                                            className="button"
                                            onClick={(e) =>
                                                toggleDistance(distance + 10)
                                            }
                                        >
                                            +10
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <br />
                            <div className="field">
                                <label className="label">
                                    Select celestial body
                                </label>
                                <div className="control">
                                    <div className="select">
                                        <select
                                            value={planet}
                                            onChange={toggleSelectPlanet}
                                        >
                                            {planetList.map((planet) => (
                                                <option
                                                    value={planet.id}
                                                    key={planet.id}
                                                >
                                                    {planet.name}
                                                </option>
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
    })

    return (
        <div className="transit">
            {/* <div className="threejs" ref={mount} /> */}
            <Scene
                mount={mount}
                planetList={planetList}
                controls={controls}
                settings={{
                    animating,
                    lighting,
                    distance,
                    manualDistance,
                    planet,
                }}
            />
            <div className="refrence-link">
                <h4>
                    Distance reference:{' '}
                    <a href="https://www.youtube.com/watch?v=Z6DpPQ8QdLg">
                        https://www.youtube.com/watch?v=Z6DpPQ8QdLg
                    </a>
                </h4>

                <h4>
                    Texture resources:{' '}
                    <a href="https://www.solarsystemscope.com/textures/">
                        https://www.solarsystemscope.com/textures/
                    </a>
                </h4>
            </div>
            <div className={isMoonShow ? '' : 'hide-moon'}>
                <Moon></Moon>
            </div>

            <div className="distance-range">
                <div className="range">
                    <input
                        type="range"
                        min="-50"
                        max="200"
                        step="1"
                        value={distance}
                        onChange={(e) => toggleDistance(e.target.value)}
                    />
                </div>
            </div>

            <ControlsModal />
        </div>
    )
}
