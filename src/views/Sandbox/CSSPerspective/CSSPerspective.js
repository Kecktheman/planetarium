
import './CSSPerspective.scss'

function CSSPerspective() {
  return (
    <div className="cssPerspective transit">
      <div className="scene rotate">
        <div className="floor"></div>
        <div className="redbox">
          <div className="front"></div>
          <div className="back"></div>
          <div className="left"></div>
          <div className="right"></div>
          <div className="top"></div>
          <div className="bottom"></div>
        </div>

        <h2 className="left">3D</h2>
        <h2 className="right">CSS</h2>

      </div>
    </div>
  );
}

export default CSSPerspective;
