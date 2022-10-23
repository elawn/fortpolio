import Experience from './Experience'
import { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Camera {
    constructor() {
        this.exp = new Experience()
        this.sizes = this.exp.sizes
        this.scene = this.exp.scene
        this.cvs = this.exp.cvs

        this.gui = this.exp.gui
        this.guiFolder = null

        this.setInstance()
        this.setControls()

        this.setupDebug()
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    setControls() {
        this.ctls = new OrbitControls( this.instance, this.cvs )
        this.ctls.enabled = false
        // this.ctls.enableDamping = true
    }

    setupDebug() {
        this.guiFolder = this.gui.addFolder( 'Camera' )
        this.guiFolder.add( this.instance.position, 'x' )
        this.guiFolder.add( this.instance.position, 'y' )
        this.guiFolder.add( this.instance.position, 'z' )
    }

    setInstance() {
        this.instance = new PerspectiveCamera( 5, this.sizes.width / this.sizes.height, 0.1, 1000 )
        this.instance.position.set( 0, 0, 16 )
        this.scene.add( this.instance )
    }

    update() {
        // this.ctls.update()
        this.instance.position.y = -window.scrollY / this.exp.sizes.height * this.sizes.objsDist
        if ( this.guiFolder ) this.guiFolder.controllers.forEach( ctl => ctl.updateDisplay() )
    }
}
