import EventEmitter from './EventEmitter'

export default class Time extends EventEmitter {
    constructor() {
        super()

        // setup
        this.start = Date.now()
        this.curr = this.start
        this.elapsed = 0
        this.delta = 16

        window.requestAnimationFrame(() => this.tick())
    }

    tick() {
        const curr = Date.now()
        this.delta = curr - this.curr
        this.curr = curr
        this.elapsed = this.curr - this.start

        this.trigger('tick')

        window.requestAnimationFrame(() => this.tick())
    }
}
