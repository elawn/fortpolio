import EventEmitter from './EventEmitter'
import Experience from '../Experience'

export default class Scroller extends EventEmitter {
    constructor() {
        super()
        this.exp = new Experience()
        this.currentSect = 0
        this.maxSect = document.querySelectorAll( 'section' ).length - 1
        this.scrollBox = document.querySelector( '#scrollbox' )
        this.killBox = false
        this.showTimeout = setTimeout( () => {
            this.showBox = true
        }, 8000 )

        this.handleScroll()
    }

    set showBox( val ) {
        this.scrollBox.classList.toggle( 'active', val )
    }

    get showBox() {
        return this.scrollBox.classList.contains( 'active' )
    }

    handleScroll() {
        window.addEventListener( 'scroll', () => {
            this.showBox = false
            clearTimeout( this.showTimeout )
            if ( !this.killBox ) {
                this.showTimeout = setTimeout( () => {
                    this.showBox = true
                }, 5000 )
            }
            const newSect = Math.round( window.scrollY / this.exp.sizes.height )
            if ( newSect !== this.currentSect ) {
                this.currentSect = newSect
                this.trigger( 'newSect', [ this.currentSect ] )
                if ( !this.killBox ) {
                    this.killBox = ( newSect === this.maxSect )
                }
            }
        } )
    }
}
