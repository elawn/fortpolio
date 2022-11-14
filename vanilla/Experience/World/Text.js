import {
    Box3, BoxGeometry, Mesh,
    MeshLambertMaterial,
    MeshMatcapMaterial,
    RepeatWrapping,
    SpotLight,
    Vector3, VideoTexture
} from 'three'
import Experience from '../Experience'
import { textureLoader, gltfLoader } from '../Utils/Loaders'
import { gsap } from 'gsap'

const FONT_TEXTURE = textureLoader.load( '/textures/matcaps/5.png' )
const LINK_LIGHT_INTENSITY = 5

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
        this.size = new Vector3()
        this.textMat = new MeshMatcapMaterial( {
            matcap: FONT_TEXTURE,
            transparent: true,
            opacity: 0
        } )

        if ( this.links.length ) {
            this.hoverMat = new MeshLambertMaterial( { color: 0xdedede } )
            this.linksMat = this.textMat.clone()
            this.linksMat.color.set( '#e84343' )
            this.linksMat.opacity = 0
        }

        gltfLoader.load( path, gltf => this.onLoad( gltf ) )
    }

    onLoad( gltf ) {
        this.group = gltf.scene
        this.group.children.filter( child => !child.name.includes( 'linkbox' ) ).forEach( child => {
            child.material = this.textMat
            child.position.y = Math.random() * -0.85 - 1
        } )
        const scale = this.exp.sizes.isVert ? 0.15 : 0.1
        this.group.scale.set( scale, scale, scale )
        this.group.rotation.y = Math.PI * 0.5
        this.group.position.y = this.id * -this.exp.sizes.objsDist

        const box = new Box3().setFromObject(this.group)
        box.getSize(this.size)

        this.scene.add( this.group )

        this.scroller.on( 'newSect', ( id ) => {
            if ( id === this.id && !this.enterStarted ) this.enter()
        } )

        if ( this.links.length ) this.buildLinks()
    }

    buildLinks() {
        for ( const link of this.links ) {
            const vidEl = document.createElement( 'video' )
            vidEl.src = `/textures/videos/${ link.key }.mp4`
            vidEl.muted = true
            vidEl.loop = true
            vidEl.playsInline = true
            vidEl.autoplay = true
            document.body.appendChild( vidEl )
            const linkTexture = new VideoTexture( vidEl )

            linkTexture.wrapS = RepeatWrapping
            linkTexture.wrapT = RepeatWrapping
            linkTexture.anisotropy = this.exp.renderer.instance.capabilities.getMaxAnisotropy()

            this.exp.world.updates.push( () => {
                linkTexture.update()
            } )

            link.children = this.group.children.filter( child => child.name.startsWith( link.key ) )
            link.children.forEach( child => {
                child.material = this.linksMat

                if ( child.name.includes( 'linkbox' ) ) {
                    child.visible = false
                    this.cursor.objects.push( child )

                    const linkLight = new SpotLight(
                        0xffffff,
                        0,
                        5.5,
                        0.14,
                        0,
                        0.5
                    )
                    linkLight.castShadow = true
                    linkLight.shadow.mapSize.width = 1024
                    linkLight.shadow.mapSize.height = 1024
                    linkLight.shadow.camera.near = 0.1
                    linkLight.shadow.camera.far = 10
                    linkLight.map = linkTexture
                    linkLight.target = child

                    const linkWorldPos = child.getWorldPosition( new Vector3() )

                    linkLight.position.set( linkWorldPos.x, linkWorldPos.y, 4 )

                    this.scene.add( linkLight )

                    link.light = linkLight

                    // const helper = new SpotLightHelper( linkLight )

                    // this.scene.add( helper )
                } else {
                    child.receiveShadow = true
                    child.castShadow = true
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

            this.exp.cvs.style.cursor = this.cursor.intersects[ 0 ]?.object.name.includes( '_linkbox' ) ?
                'pointer' : 'auto'
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
            child.material = this.hoverMat
            child.material.needsUpdate = true
        }
        link.light.intensity = LINK_LIGHT_INTENSITY
        this.hoverMat.color.set( link.hoverColor )
    }

    handleMouseLeave( link ) {
        for ( const child of link.children ) {
            child.material = this.linksMat
        }
        link.light.intensity = 0
    }

    handleClick( link ) {
        if ( link === undefined ) return
        window.open( link.url, '_blank' )
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
