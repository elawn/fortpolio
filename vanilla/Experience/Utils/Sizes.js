import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter {
    constructor() {
        super()
        this.vertMin = 4 / 5
        this.setSizes()
        this.objsDist = this.isVert ? 3 : 1.5
        window.addEventListener( 'resize', () => {
            this.setSizes()
            this.trigger('resize')
        } )
    }

    get isVert() {
        return this.width / this.height <= this.vertMin
    }

    setSizes() {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min( window.devicePixelRatio, 2 )
    }
}
