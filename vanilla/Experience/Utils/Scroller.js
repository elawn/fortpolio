import EventEmitter from './EventEmitter'
import Experience from '../Experience'

export default class Scroller extends EventEmitter {
    constructor() {
        super()
        this.exp = new Experience()
        this.currentSect = 0

        this.handleScroll()
    }

    handleScroll() {
        window.addEventListener( 'scroll', () => {
            const newSect = Math.round( window.scrollY / this.exp.sizes.height )
            if ( newSect !== this.currentSect ) {
                this.currentSect = newSect
                this.trigger( 'newSect', [ this.currentSect ] )
            }
        } )
    }
}
