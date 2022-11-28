import { MeshLambertMaterial } from 'three'
import { textureLoader } from './Loaders'

export const hoverMat = new MeshLambertMaterial( { color: 0xdedede } )

export const matcaps = [
    textureLoader.load('/textures/matcaps/1.png'),
    textureLoader.load('/textures/matcaps/2.png'),
    textureLoader.load('/textures/matcaps/3.png'),
    textureLoader.load('/textures/matcaps/4.png'),
    textureLoader.load('/textures/matcaps/5.png'),
    textureLoader.load('/textures/matcaps/6.png'),
    textureLoader.load('/textures/matcaps/7.png'),
    textureLoader.load('/textures/matcaps/8.png'),
    textureLoader.load('/textures/matcaps/9.png')
]
