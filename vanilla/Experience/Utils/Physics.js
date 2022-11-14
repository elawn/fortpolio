import Matter from 'matter-js'
import Experience from '../Experience'

export default class Physics {
    constructor() {
        this.exp = new Experience()
        this.engine = Matter.Engine.create()
        this.bodies = Matter.Bodies
    }

    add( object ) {
        Matter.Composite.add( this.engine.world, object )
    }

    update() {
        Matter.Engine.update( this.engine, this.exp.time.delta, this.exp.time.correction )
    }
}
