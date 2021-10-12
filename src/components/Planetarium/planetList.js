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

const planetList = [
    { id: 0, name: 'Sun', scale: 109, rotationScale: 1, image: sun_image },
    {
        id: 1,
        name: 'Mercury',
        scale: 0.383,
        rotationScale: 58.646,
        image: mercury_image,
    },
    {
        id: 2,
        name: 'Venus',
        scale: 0.949,
        rotationScale: 243.018,
        image: venus_image,
    },
    {
        id: 3,
        name: 'Earth',
        scale: 1,
        rotationScale: 1,
        image: earth_image,
        clouds: {
            scale: 1.005,
            image: earth_cloudMap,
        },
    },
    {
        id: 4,
        name: 'Mars',
        scale: 0.532,
        rotationScale: 1.026,
        image: mars_image,
    },
    {
        id: 5,
        name: 'Jupiter',
        scale: 11.21,
        rotationScale: 0.41354,
        image: jupiter_image,
    },
    {
        id: 6,
        name: 'Saturn',
        scale: 9.45,
        rotationScale: 0.444,
        image: saturn_image,
    },
    {
        id: 7,
        name: 'Uranus',
        scale: 4.01,
        rotationScale: 0.718,
        image: uranus_image,
    },
    {
        id: 8,
        name: 'Neptune',
        scale: 3.88,
        rotationScale: 0.671,
        image: neptune_image,
    },
]

export default planetList
