import EventEmitter from './EventEmitter'
import { Clock } from 'three'

export default class Time extends EventEmitter {
    constructor() {
        super()

        this.clock = new Clock( true )
        this.start = this.clock.startTime
        this.curr = this.start
        this.elapsed = 0
        this.delta = 16
        this.step = 1 / 60
        this.stepProg = 0

        window.requestAnimationFrame( () => this.tick() )
    }

    tick() {
        window.requestAnimationFrame( () => this.tick() )
        this.delta = this.clock.getDelta()
        this.elapsed = this.clock.getElapsedTime()
        this.curr = this.clock.oldTime
        this.stepProg += this.delta

        if ( this.stepProg > this.step ) {
            this.trigger( 'tick' )
            this.stepProg = this.stepProg % this.step
        }

    }
}
