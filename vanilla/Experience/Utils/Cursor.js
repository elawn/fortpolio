import EventEmitter from './EventEmitter'
import Experience from '../Experience'
import { Raycaster, Vector2 } from 'three'

export default class Cursor extends EventEmitter {
    constructor() {
        super()
        this.exp = new Experience()
        this.cursor = new Vector2()
        this.raycaster = new Raycaster()
        this.objects = []
        this.intersects = []

        this.addListeners()
    }

    addListeners() {
        window.addEventListener( 'mousemove', ( { clientX, clientY } ) => {
            this.cursor.x = clientX / this.exp.sizes.width * 2 - 1
            this.cursor.y = -( clientY / this.exp.sizes.height ) * 2 + 1
        } )

        window.addEventListener( 'click', () => {
            if ( this.exp.sizes.isVert ) {
                setTimeout( () => {
                    if ( this.intersects.length ) {
                        this.trigger( 'click', [ this.intersects ] )
                        this.intersects = []
                    }
                }, 100 )
            } else {
                if ( this.intersects.length ) this.trigger( 'click', [ this.intersects ] )
            }
        } )
    }

    update() {
        this.raycaster.setFromCamera( this.cursor, this.exp.cam.instance )
        const intersects = this.raycaster.intersectObjects( this.objects )
        if ( intersects.length !== this.intersects.length ) {
            this.intersects = intersects
            this.trigger( 'intersectChange', [ this.intersects ] )
            this.exp.cvs.style.cursor = this.intersects[ 0 ]?.object.name.includes( '_linkbox' ) ?
                'pointer' : 'auto'
        }
    }
}
