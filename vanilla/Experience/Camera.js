import { gsap } from 'gsap'
import Experience from './Experience'
import { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Camera {
    constructor() {
        this.debug = false

        this.exp = new Experience()
        this.sizes = this.exp.sizes
        this.scene = this.exp.scene
        this.cvs = this.exp.cvs

        this.baseY = -1.92119

        this.gui = this.exp.gui
        this.guiFolder = null
        this.setInstance()
        this.setControls()

        this.setupDebug()
    }

    get currY () {
        return ( -window.scrollY / this.exp.sizes.height * this.sizes.objsDist ) + this.baseY
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    setControls() {
        this.ctls = new OrbitControls( this.instance, this.cvs )
        this.ctls.enabled = this.debug
        // this.ctls.enableDamping = this.debug
    }

    setupDebug() {
        this.guiFolder = this.gui.addFolder( 'Camera' )
        this.guiFolder.add( this.instance.position, 'x' )
        this.guiFolder.add( this.instance.position, 'y' )
        this.guiFolder.add( this.instance.position, 'z' )
    }

    setInstance() {
        this.instance = new PerspectiveCamera( 5, this.sizes.width / this.sizes.height, 0.1, 1000 )
        this.instance.position.set(
            -3.11345,
            this.baseY,
            15.57611 )
        this.instance.lookAt( 0, this.currY, 0 )
        this.scene.add( this.instance )

        gsap.to( this.instance.position, {
            duration: 1,
            ease: 'sine.inOut',
            repeat: 3,
            yoyo: true,
            onUpdate: () => {
                this.instance.lookAt( 0, this.currY - this.baseY, 0 )
            },
            scrollTrigger: {
                trigger: '#sections',
                scrub: 1,
                end: 'bottom bottom'
            },
            x: 2,
            z: 16.5
        } )
    }

    update() {
        if ( this.debug ) {
            this.ctls.update()
        } else {
            this.instance.position.y = this.currY
        }
        if ( this.guiFolder ) this.guiFolder.controllers.forEach( ctl => ctl.updateDisplay() )
    }
}
