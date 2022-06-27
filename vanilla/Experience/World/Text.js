import { MeshBasicMaterial, MeshMatcapMaterial } from 'three'
import Experience from '../Experience'
import { textureLoader, gltfLoader } from '../Utils/Loaders'
import { gsap } from 'gsap'

const fontTexture = textureLoader.load( '/textures/matcaps/5.png' )

export default class Text {
    constructor( path, id, links = [] ) {
        this.exp = new Experience()
        this.scene = this.exp.scene
        this.cursor = this.exp.cursor
        this.group = null
        this.scroller = this.exp.scroller
        this.id = id
        this.links = links
        this.enterStarted = false
        this.textMat = new MeshMatcapMaterial( {
            matcap: fontTexture,
            transparent: true
        } )
        if ( this.links.length ) {
            this.linksMat = this.textMat.clone()
            this.linksMat.color.set( '#e84343' )
        }

        gltfLoader.load( path, gltf => this.onLoad( gltf ) )
    }

    onLoad( gltf ) {
        this.group = gltf.scene
        this.group.children.filter(child => !child.name.includes('linkbox')).forEach( child => {
            child.material = this.textMat
            // child.material.opacity = 0
            child.position.y = Math.random() * -0.85 - 1
        } )
        this.group.scale.set( 0.1, 0.1, 0.1 )
        this.group.rotation.y = Math.PI * 0.5
        this.group.position.y = this.id * -this.exp.sizes.objsDist
        this.scene.add( this.group )

        this.scroller.on( 'newSect', ( id ) => {
            if ( id === this.id && !this.enterStarted ) this.enter()
        } )

        if ( this.links.length ) this.buildLinks()
    }

    buildLinks() {
        for ( const link of this.links ) {
            const linkTexture = textureLoader.load( `/textures/gifs/tbx.gif` ) // update when others are done
            link.hoverMat = new MeshBasicMaterial( { map: linkTexture } )

            link.children = this.group.children.filter( child => child.name.startsWith( link.key ) )
            link.children.forEach( child => {
                child.material = this.linksMat

                if ( child.name.includes( 'linkbox' ) ) {
                    child.visible = false
                    this.cursor.objects.push( child )
                }
            } )
        }
        this.cursor.on( 'intersectChange', () => {
            if ( this.cursor.intersects.length ) {
                for ( const link of this.links ) {
                    this.cursor.intersects[ 0 ].object.name === `${ link.key }_linkbox` ? this.handleMouseEnter( link ) :
                        this.handleMouseLeave( link )
                }
            } else {
                for ( const link of this.links ) {
                    this.handleMouseLeave( link )
                }
            }
        } )
        window.addEventListener( 'click', () => {
            if ( this.cursor.intersects.length ) {
                this.handleClick(
                    this.links.find( link => this.cursor.intersects[ 0 ].object.name === `${ link.key }_linkbox` )
                )
            }
        } )
    }

    handleMouseEnter( link ) {
        for ( const child of link.children ) {
            child.material = link.hoverMat
        }
    }

    handleMouseLeave( link ) {
        for ( const child of link.children ) {
            child.material = this.linksMat
        }
    }

    handleClick( link ) {
        if ( link === undefined ) return
        console.log( link.url )
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
