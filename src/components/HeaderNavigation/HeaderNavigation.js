import Brand from '../Brand';
import './HeaderNavigation.scss';

function HeaderNavigation() {

  return (
    <div className="container">
      <nav className="navbar is-transparent">
      <div className="navbar-burger" data-target="navbarMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      <div id="navbarMenu" className="navbar-menu">
        <div className="navbar-start">
          
        </div>

        <div className="navbar-end">
          
        </div>
      </div>
    </nav>
    </div>
  );
}

export default HeaderNavigation;
