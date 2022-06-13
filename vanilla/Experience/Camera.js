import Experience from './Experience'
import { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Camera {
    constructor() {
        this.exp = new Experience()
        this.sizes = this.exp.sizes
        this.scene = this.exp.scene
        this.cvs = this.exp.cvs

        this.setInstance()
        this.setControls()
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    setControls() {
        this.ctls = new OrbitControls(this.instance, this.cvs)
        this.ctls.enableDamping = true
    }

    setInstance() {
        this.instance = new PerspectiveCamera( 5, this.sizes.width / this.sizes.height, 0.1, 100 )
        this.instance.position.set( -4, 2, 15 )
        this.scene.add( this.instance )
    }

    update() {
        this.ctls.update()
    }
}
