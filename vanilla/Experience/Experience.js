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
        this.debug = false
        if (import.meta.env.MODE === 'development') this.setupDebug()

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
        this.loadingBar = document.querySelector( '#loading-bar-inner' )

        // enable orbitcontrols on cmd down
        window.addEventListener( 'keydown', ( { key } ) => {
            this.cam.ctls.enabled = key === 'Meta'
        } )
        window.addEventListener( 'keyup', ( { key } ) => {
            this.cam.ctls.enabled = !( key === 'Meta' )
        } )

        this.sizes.on( 'resize', () => this.resize() )
        this.time.on( 'tick', () => this.update() )

        DefaultLoadingManager.onProgress = ( _, loaded, total ) => this.onProgress( loaded, total )
        DefaultLoadingManager.onLoad = () => this.onLoad()
    }

    setupDebug() {
        this.debug = true
        this.gui = new dat.GUI()
        this.debugObj = {
            matcap: 5
        }
        this.gui
            .add( this.debugObj, 'matcap', Array( 9 ).fill( 0 ).map( ( _, idx ) => idx + 1 ) )
            .onChange( value => this.updateMatcaps( value ) )
        this.gui.close()
        this.stats = new Stats()
        this.stats.showPanel( 0 )
        document.body.appendChild( this.stats.dom )
    }

    onProgress( loaded, total ) {
        this.loadingBar.style.width = `${ ( loaded / total ) * 100 }%`
    }

    onLoad() {
        setTimeout( () => {
            document.body.classList.remove( 'loading' )
            this.loaded = true
            this.world.onLoad()
        }, 500 )
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
