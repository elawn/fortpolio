import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import { DefaultLoadingManager, Mesh, MeshMatcapMaterial, Scene } from 'three'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Scroller from './Utils/Scroller'
import * as dat from 'lil-gui'
import { textureLoader } from './Utils/Loaders'
import Cursor from './Utils/Cursor'
import Stats from 'three/examples/jsm/libs/stats.module'
import Physics from './Utils/Physics'

let instance = null

export default class Experience {
    constructor( cvs ) {
        if ( instance ) return instance
        instance = this

        // debug
        this.gui = new dat.GUI()
        this.debugObj = {
            matcap: 5
        }
        this.gui
            .add( this.debugObj, 'matcap', Array( 9 ).fill( 0 ).map( ( _, idx ) => idx + 1 ) )
            .onChange( value => this.updateMatcaps( value ) )
        this.gui.close()
        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.appendChild(this.stats.dom)

        // setup
        this.cvs = cvs
        this.sizes = new Sizes()
        this.time = new Time()
        this.phys = new Physics()
        this.scroller = new Scroller()
        this.scene = new Scene()
        this.cam = new Camera()
        this.renderer = new Renderer()
        this.cursor = new Cursor()
        this.world = new World()
        this.loaded = false

        // disable orbitcontrols on cmd down
        window.addEventListener( 'keydown', ( { key } ) => {
            this.cam.ctls.enabled = key === 'Meta'
        } )
        window.addEventListener( 'keyup', ( { key } ) => {
            this.cam.ctls.enabled = !( key === 'Meta' )
        } )

        // handle resize
        this.sizes.on( 'resize', () => this.resize() )

        // tick event
        this.time.on( 'tick', () => this.update() )

        DefaultLoadingManager.onLoad = () => this.onLoad()
    }

    onLoad() {
        this.loaded = true
        this.world.onLoad()
    }

    resize() {
        this.world.setFov()
        this.cam.resize()
        this.renderer.resize()
    }

    update() {
        this.stats.begin()

        this.cam.update()
        this.cursor.update()
        this.world.update()
        this.phys.update()
        this.renderer.update()

        this.stats.end()
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
