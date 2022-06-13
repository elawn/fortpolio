import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import { Mesh, MeshMatcapMaterial, Scene } from 'three'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import * as dat from 'lil-gui'
import { textureLoader } from './Utils/Loaders'

let instance = null

export default class Experience {
    constructor( cvs ) {
        if ( instance ) return instance
        instance = this

        // setup
        this.cvs = cvs
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new Scene()
        this.cam = new Camera
        this.renderer = new Renderer()
        this.world = new World()
        this.ready = false

        // debug
        this.gui = new dat.GUI()
        this.debugObj = {
            matcap: 5
        }
        this.gui
            .add( this.debugObj, 'matcap', Array( 9 ).fill( 0 ).map( ( _, idx ) => idx + 1 ) )
            .onChange( value => this.updateMatcaps( value ) )

        // handle resize
        this.sizes.on( 'resize', () => this.resize() )

        // tick event
        this.time.on( 'tick', () => this.update() )
    }

    resize() {
        this.cam.resize()
        this.renderer.resize()
    }

    update() {
        this.cam.update()
        this.renderer.update()
    }

    updateMatcaps( newVal ) {
        const newTexture = textureLoader.load( `/textures/matcaps/${ newVal }.png` )
        const newMatcap = new MeshMatcapMaterial( { matcap: newTexture } )

        this.scene.traverse( child => {
            if ( child instanceof Mesh && child.material instanceof MeshMatcapMaterial ) {
                child.material = newMatcap
            }
        } )
    }
}
