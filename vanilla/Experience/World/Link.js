import Experience from '../Experience'
import { hoverMat } from '../Utils/Materials'
import { RepeatWrapping, SpotLight, Vector3, VideoTexture } from 'three'

const LINK_LIGHT_INTENSITY = 9

export default class Link {
    constructor( link, children, mat ) {
        this.exp = new Experience()
        this.cursor = this.exp.cursor
        this.link = link
        this.children = children
        this.mat = mat

        this.buildTexture()
        this.buildLight()
        this.addListeners()
        this.setupChildren()
    }

    setupChildren() {
        this.children.forEach( child => {
            if ( child.name.includes( 'linkbox' ) ) {
                child.visible = false
                this.cursor.objects.push( child )
                const linkWorldPos = child.getWorldPosition( new Vector3() )
                this.light.position.set( linkWorldPos.x, linkWorldPos.y, 4 )
                this.light.target = child
            } else {
                child.material = this.mat
                child.receiveShadow = true
                child.castShadow = true
            }
        } )
    }

    buildTexture() {
        const vidEl = document.createElement( 'video' )
        vidEl.src = `/textures/videos/${ this.link.key }.mp4`
        vidEl.muted = true
        vidEl.loop = true
        vidEl.playsInline = true
        vidEl.autoplay = true
        document.body.appendChild( vidEl )

        this.lightTexture = new VideoTexture( vidEl )
        this.lightTexture.wrapS = RepeatWrapping
        this.lightTexture.wrapT = RepeatWrapping
        this.lightTexture.anisotropy = this.exp.renderer.maxAnisotropy

        this.exp.world.updates.push( () => this.lightTexture.update() )
    }

    buildLight() {
        this.light = new SpotLight(
            0xffffff,
            0,
            5,
            0.14,
            0,
            0.5
        )
        this.light.castShadow = true
        this.light.shadow.camera.near = 0.1
        this.light.shadow.camera.far = 10
        this.light.map = this.lightTexture

        this.exp.scene.add( this.light )
    }

    addListeners() {
        this.cursor.on( 'intersectChange', ( i ) => {
            if ( this.children[ 0 ].material.opacity !== 1 ) return
            if ( i.length && i[ 0 ].object.name === `${ this.link.key }_linkbox` ) this.handleMouseEnter()
            else this.handleMouseLeave()
        } )

        this.cursor.on( 'click', ( i ) => {
            if ( this.children[ 0 ].material.opacity !== 1 ) return
            if ( i[ 0 ].object.name === `${ this.link.key }_linkbox` ) window.open( this.link.url, '_blank' )
        } )
    }

    handleMouseEnter() {
        for ( const child of this.children ) {
            child.material = hoverMat
            child.material.needsUpdate = true
        }
        this.light.intensity = LINK_LIGHT_INTENSITY
        hoverMat.color.set( this.link.hoverColor )
    }

    handleMouseLeave() {
        for ( const child of this.children ) {
            child.material = this.mat
        }
        this.light.intensity = 0
    }
}
