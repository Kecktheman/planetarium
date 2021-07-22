import Home from './views/Home/Home'
import Chat from './views/Chat/Chat'

import Sandbox from './views/Sandbox/Sandbox'
import CSSPerspective from './views/Sandbox/CSSPerspective/CSSPerspective'

import Earthwatch from './views/Sandbox/Earthwatch/Earthwatch'

var routes = function() {
    return [
        {
            path: '/',
            exact: true,
            name: 'Home',
            component: <Home></Home>,
            routes: []
        },
        {
            path: '/chat',
            exact: true,
            name: 'Chat',
            component: <Chat></Chat>,
            routes: []
        },
        {
            path: '/downloads',
            name: 'Downloads',
            component: <Chat></Chat>,
            routes: [
                {
                    path: '/downloads/quickmeme',
                    name: 'Quickmeme',
                    component: <Chat></Chat>
                },
                {
                    path: '/downloads/test',
                    name: 'Test',
                    component: <Chat></Chat>
                }
            ]
        },
        {
            path: '/sandbox',
            exact: true,
            name: 'Sandbox',
            component: <Sandbox></Sandbox>,
            routes: [
                {
                    path: '/sandbox/earthwatch',
                    name: 'Earthwatch',
                    component: <Earthwatch></Earthwatch>
                },
                {
                    path: '/sandbox/css-perspective',
                    name: '3D Showroom',
                    component: () => {return(<div>Test</div>)}
                },
                {
                    path: '/sandbox/coffee-composition',
                    name: 'Coffee Composition',
                    component: () => {return(<div>Test</div>)}
                }
            ]
        },
        {
            path: '*',
            component: <div>404</div>
        }
    ]
}();

export default routes