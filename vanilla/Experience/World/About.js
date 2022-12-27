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

        this.window.querySelector( '#num-years' ).innerHTML = this.getYears()
    }

    close() {
        this.window.classList.remove( 'active' )
    }

    getYears() {
        const startDate = new Date( '1/1/2014' )
        return Math.floor( ( Date.now() - startDate ) / 1000 / 60 / 60 / 24 / 365 )
    }
}
