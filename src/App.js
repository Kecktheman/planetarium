import React from "react";

import HeaderNavigation from "./components/HeaderNavigation/HeaderNavigation";
import Planetarium from "./components/Planetarium/Planetarium";

export default function App() {
  return (
    <div
      id="wrapper-root"
      className="is-flex is-flex-direction-column	is-align-items-center">
      <HeaderNavigation></HeaderNavigation>

      <section
        id="content-root"
        className="container not-relative is-flex-grow-1">
        <Planetarium></Planetarium>
      </section>
    </div>
  );
}
