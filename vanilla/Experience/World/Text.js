import { Box3, Vector3, MeshMatcapMaterial } from 'three'
import Experience from '../Experience'
import { gltfLoader, textureLoader } from '../Utils/Loaders'
import { gsap } from 'gsap'
import Link from './Link'
import { Body, Convex } from 'p2'
import Ball from './Ball'

const FONT_TEXTURE = textureLoader.load( '/textures/matcaps/5.png' )

export default class Text {
    constructor( path, id, links = [], xOffset = 0, yOffset = 0 ) {
        this.exp = new Experience()
        this.scene = this.exp.scene
        this.group = null
        this.scroller = this.exp.scroller
        this.id = id
        this.links = links
        this.xOffset = xOffset
        this.yOffset = yOffset
        this.enterStarted = false
        this.size = new Vector3()
        this.textMat = new MeshMatcapMaterial( {
            matcap: FONT_TEXTURE,
            transparent: true,
            opacity: 0
        } )
        this.ballsMade = false

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
        this.group.position.y = this.id * -this.exp.sizes.objsDist + this.yOffset
        this.group.position.x = this.xOffset

        this.box = new Box3().setFromObject( this.group )
        this.box.getSize( this.size )

        // TODO: clean this all up eventually
        this.physBody = new Body()

        this.group.children.filter( child => !child.name.includes( 'linkbox' ) ).forEach( child => {
            child.material = this.textMat

            // GET BOUNDING BOX VERTICES OF CHAR
            const charBox = new Box3().setFromObject( child )
            const { max, min } = charBox

            const charShape = new Convex( {
                vertices: [
                    [ min.x + 0.0011, max.y ], // tweak to imitate font slant
                    [ min.x, min.y ],
                    [ max.x - 0.0011, min.y ], // tweak to imitate font slant
                    [ max.x, max.y ]
                ]
            } )
            charShape.material = this.exp.phys.charMaterial
            this.physBody.addShape( charShape ) // do we need an offset?

            child.position.y = Math.random() * -0.85 - 1
        } )

        this.exp.phys.world.addBody( this.physBody )

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
                delay: delay * 1.1,
                onComplete: () => {
                    if ( !this.ballsMade ) this.makeBalls()
                }
            } )
            gsap.to( child.material, {
                duration: duration / 2,
                ease: 'power1.in',
                opacity: 1,
                delay
            } )
        } )
    }

    makeBalls() {
        this.ballsMade = true
        this.makeBall()
        setInterval( () => this.makeBall(), 2000 )
    }

    makeBall() {
        new Ball(
            this.box.max.y + 0.75,
            !this.id % 2 ? 'left' : 'right'
        )
    }
}
