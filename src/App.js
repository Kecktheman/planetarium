import React from 'react'
import Planetarium from './Planetarium/Planetarium'

export default function App() {
    return (
        <div
            id="wrapper-root"
            className="is-flex is-flex-direction-column	is-align-items-center"
        >
            <section
                id="content-root"
                className="container not-relative is-flex-grow-1"
            >
                <Planetarium></Planetarium>
            </section>
        </div>
    )
}
