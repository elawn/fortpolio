import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
        this.touchstartY = null
        this.touchAnimating = false

        this.baseY = -1.92119

        this.setInstance()
        this.setControls()

        if ( this.exp.debug ) {
            this.gui = this.exp.gui
            this.guiFolder = null
            this.setupDebug()
        }
    }

    get currY() {
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
                scrub: 0.25,
                end: 'bottom bottom'
            },
            x: 2,
            z: 16.5
        } )

        this.handleTouch()
    }

    handleTouch() {
        window.addEventListener( 'touchstart', ( { touches: { 0: { clientY } } } ) => {
            this.touchstartY = clientY
        } )

        window.addEventListener( 'touchmove', ( { touches: { 0: { clientY } } } ) => {
            if ( this.touchstartY !== null && !this.touchAnimating && Math.abs( this.touchstartY - clientY ) > 50 ) {
                const scrollFactor = this.touchstartY - clientY > 0 ? 1 : -1
                if ( ( scrollFactor === -1 && this.exp.scroller.currentSect > 0 ) || ( scrollFactor === 1 && this.exp.scroller.currentSect < this.exp.scroller.maxSect ) ) {
                    this.touchAnimating = true
                    gsap.to( window, {
                        scrollY: `+=${ window.innerHeight * scrollFactor }`,
                        duration: 1.5,
                        ease: 'power2.inOut',
                        onUpdate: () => {
                            this.exp.scroller.handleScroll()
                            ScrollTrigger.update()
                        },
                        onComplete: () => {
                            this.touchAnimating = false
                        }
                    } )
                }
            }
        } )

        window.addEventListener( 'touchend', () => {
            this.touchstartY = null
        } )
    }

    update() {
        if ( this.debug ) {
            this.ctls.update()
        } else {
            this.instance.position.y = this.currY
        }
        if ( this.exp.debug ) this.guiFolder.controllers.forEach( ctl => ctl.updateDisplay() )
    }
}
