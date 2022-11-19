import { Box3, Vector3, MeshMatcapMaterial, Mesh, BoxGeometry, Vector2 } from 'three'
import Experience from '../Experience'
import { gltfLoader, textureLoader } from '../Utils/Loaders'
import { gsap } from 'gsap'
import Link from './Link'

const FONT_TEXTURE = textureLoader.load( '/textures/matcaps/5.png' )

export default class Text {
    constructor( path, id, links = [] ) {
        this.exp = new Experience()
        this.scene = this.exp.scene
        this.group = null
        this.scroller = this.exp.scroller
        this.id = id
        this.links = links
        this.enterStarted = false
        this.size = new Vector3()
        this.textMat = new MeshMatcapMaterial( {
            matcap: FONT_TEXTURE,
            transparent: true,
            opacity: 0
        } )
        this.twoDeeVertices = []

        if ( this.links.length ) {
            this.linksMat = this.textMat.clone()
            this.linksMat.color.set( '#e84343' )
        }

        gltfLoader.load( path, gltf => this.onLoad( gltf ) )
    }

    onLoad( gltf ) {
        this.group = gltf.scene
        const scale = this.exp.sizes.isVert ? 0.15 : 0.1
        this.group.scale.set( scale, scale, scale )
        this.group.rotation.y = Math.PI * 0.5
        this.group.position.y = this.id * -this.exp.sizes.objsDist

        this.group.children.filter( child => !child.name.includes( 'linkbox' ) ).forEach( child => {
            child.material = this.textMat

            const child2dVertices = []
            const childPos = child.geometry.attributes.position
            for ( let i = 0, len = childPos.count; i < len; i++ ) {
                const vertex = new Vector3()
                vertex.fromBufferAttribute( childPos, 0 )
                const worldVertex = child.localToWorld( vertex )
                child2dVertices.push( { x: worldVertex.x, y: worldVertex.y } )
            }
            this.twoDeeVertices.push( child2dVertices )

            child.position.y = Math.random() * -0.85 - 1
        } )

        const box = new Box3().setFromObject( this.group )
        box.getSize( this.size )

        this.scene.add( this.group )

        this.scene.updateMatrixWorld()

        this.scroller.on( 'newSect', ( id ) => {
            if ( id === this.id && !this.enterStarted ) this.enter()
        } )

        if ( this.links.length ) this.buildLinks()
    }

    buildLinks() {
        for ( const link of this.links ) {
            new Link(
                link,
                this.group.children.filter( child => child.name.startsWith( link.key ) ),
                this.linksMat
            )
        }
    }

    enter( delay = 0 ) {
        this.enterStarted = true
        const duration = 4
        this.group.children.filter( child => !child.name.includes( 'linkbox' ) ).forEach( child => {
            gsap.to( child.position, {
                duration,
                ease: 'expo.out',
                y: 0,
                delay: delay * 1.1
            } )
            gsap.to( child.material, {
                duration: duration / 2,
                ease: 'power1.in',
                opacity: 1,
                delay
            } )
        } )
    }
}
