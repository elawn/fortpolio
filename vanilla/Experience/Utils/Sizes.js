import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter {
    constructor() {
        super()
        this.objsDist = 1.5
        this.setSizes()
        window.addEventListener( 'resize', () => {
            this.setSizes()
            this.trigger('resize')
        } )
    }

    setSizes() {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min( window.devicePixelRatio, 2 )
    }
}
