import { World } from 'p2'
import Experience from '../Experience'

export default class Physics {
    constructor() {
        this.exp = new Experience()
        this.world = new World( {
            gravity: [ 0, -9.82 ]
        } )
        this.step = 1 / 60
    }

    update() {
        this.world.step( this.step, this.exp.time.delta )
    }
}
