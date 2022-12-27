import EventEmitter from './EventEmitter'
import Experience from '../Experience'

export default class Scroller extends EventEmitter {
    constructor() {
        super()
        this.exp = new Experience()
        this.currentSect = 0
        this.maxSect = document.querySelectorAll( 'section' ).length - 1
        this.scrollBox = document.querySelector( '#scrollbox' )
        this.menuBox = document.querySelector( '#bottom-menu' )
        this.killBox = false
        this.showTimeout = setTimeout( () => {
            this.showBox = true
        }, 8000 )

        window.addEventListener( 'scroll', () => this.handleScroll() )
    }

    set showBox( val ) {
        this.scrollBox.classList.toggle( 'active', val )
    }

    set showMenu( val ) {
        this.menuBox.classList.toggle( 'active', val )
    }

    handleScroll() {
        this.showBox = false
        clearTimeout( this.showTimeout )
        if ( !this.killBox ) {
            this.showTimeout = setTimeout( () => {
                this.showBox = true
            }, 5000 )
        }
        this.showMenu = ( window.scrollY > document.body.clientHeight - window.innerHeight - 150 )
        const newSect = Math.round( window.scrollY / this.exp.sizes.height )
        if ( newSect !== this.currentSect ) {
            this.currentSect = newSect
            this.trigger( 'newSect', [ this.currentSect ] )
            if ( !this.killBox ) {
                this.killBox = ( newSect === this.maxSect )
            }
        }
    }
}
