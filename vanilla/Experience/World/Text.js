import { AdditiveBlending, MeshMatcapMaterial, MeshNormalMaterial, NoBlending, SubtractiveBlending } from 'three'
import Experience from '../Experience'
import { textureLoader, gltfLoader } from '../Utils/Loaders'
import { gsap } from 'gsap'

const fontTexture = textureLoader.load( '/textures/matcaps/5.png' )
const textMat = new MeshMatcapMaterial( {
    matcap: fontTexture,
    transparent: true
} )
// const textMat = new MeshNormalMaterial()

export default class Text {
    constructor( path ) {
        this.exp = new Experience()
        this.scene = this.exp.scene
        this.group = null

        gltfLoader.load(
            path,
            gltf => {
                this.group = gltf.scene
                this.group.children.forEach( child => {
                    child.material = textMat
                    child.material.opacity = 0
                    child.position.y = Math.random() * -0.85 - 0.5
                } )
                console.log( this.group.children[ 2 ] )
                this.group.scale.set( 0.1, 0.1, 0.1 )
                this.group.rotation.y = Math.PI * 0.5
                this.scene.add( this.group )
            }
        )
    }

    enter(delay = 0) {
        const duration = 4
        this.group.children.forEach(child => {
            gsap.to(child.position, {
                duration,
                ease: 'expo.out',
                y: 0,
                delay: delay * 1.1
            })
            gsap.to(child.material, {
                duration: duration / 2,
                ease: 'power1.in',
                opacity: 1,
                delay
            })
        })
    }
}
