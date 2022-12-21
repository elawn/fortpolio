export default class About {
    constructor() {
        this.window = document.querySelector( '#about-wrap' )
        this.menuBtn = document.querySelector( '#bottom-menu .about' )
        this.closeBtn = this.window.querySelector( '.close-box' )

        this.menuBtn.addEventListener( 'click', e => {
            e.preventDefault()
            this.window.classList.add( 'active' )
        } )

        this.closeBtn.addEventListener( 'click', () => this.close() )

        this.window.addEventListener( 'click', ( { target } ) => {
            if ( target === this.window ) this.close()
        } )

        window.addEventListener( 'keydown', ( { key } ) => {
            if ( key === 'Escape' ) this.close()
        } )
    }

    close() {
        this.window.classList.remove( 'active' )
    }
}
