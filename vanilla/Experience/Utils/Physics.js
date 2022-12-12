import { ContactMaterial, Material, World } from 'p2'
import Experience from '../Experience'

export default class Physics {
    constructor() {
        this.exp = new Experience()
        this.world = new World( {
            gravity: [ 0, -0.02 ],
            islandSplit: true
        } )
        this.step = 1 / 60
        this.ballMaterial = new Material( 0 )
        this.charMaterial = new Material( 1 )
        this.world.addContactMaterial( new ContactMaterial( this.charMaterial, this.ballMaterial, {
            restitution: 1,
            stiffness: Number.MAX_VALUE,
            friction: 0
        } ) )
        this.world.sleepMode = World.BODY_SLEEPING
        this.world.solver.tolerance = 0.1
        this.world.solver.iterations = 7
    }

    update() {
        this.world.step( this.step, this.exp.time.delta * 20 )
    }
}
