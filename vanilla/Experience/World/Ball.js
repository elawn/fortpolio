import Experience from '../Experience'
import { Body, Circle } from 'p2'
import { Mesh, MeshMatcapMaterial, SphereGeometry } from 'three'
import { matcaps } from '../Utils/Materials'
import { gsap } from 'gsap'
import scene from 'three/addons/offscreen/scene'

export default class Ball {
    constructor( y, side ) {
        this.exp = new Experience()
        this.y = y
        this.side = side
        this.minRad = 0.01
        this.maxRad = 0.07
        this.rad = Math.min( Math.random() * this.maxRad + this.minRad, this.maxRad )
        this.fadingOut = false

        this.makePhys()
        this.makeBall()

        this.exp.world.balls[ this.ball.uuid ] = this
    }

    makePhys() {
        this.physBall = new Body( {
            position: [
                this.side === 'left' ? -1 : 1,
                this.y
            ],
            mass: 1,
            velocity: [ this.side === 'left' ? 0.05 : -0.05, 0 ]
        } )
        const ballShape = new Circle( { radius: this.rad } )
        ballShape.material = this.exp.phys.ballMaterial
        this.physBall.addShape( ballShape )
        this.physBall.damping = 0.05
        this.physBall.angularDamping = 0.05

        this.exp.phys.world.addBody( this.physBall )
    }

    makeBall() {
        this.ball = new Mesh(
            new SphereGeometry( this.rad ),
            new MeshMatcapMaterial( {
                matcap: matcaps[ Math.floor( Math.random() * matcaps.length ) ],
                transparent: true
            } )
        )
        this.ball.position.set( ...this.physBall.position, 0 )

        this.exp.scene.add( this.ball )
    }

    update() {
        this.ball.position.set( ...this.physBall.position, 0 )
        this.ball.rotation.z = this.physBall.angle
        if ( !this.fadingOut && this.ball.position.y < this.y - this.exp.sizes.objsDist ) {
            this.fadeOut()
        }
    }

    fadeOut() {
        this.fadingOut = true
        gsap.to( this.ball.material, {
            opacity: 0,
            duration: 1.5,
            onComplete: () => this.destroy()
        } )
    }

    destroy() {
        delete this.exp.world.balls[ this.ball.uuid ]
        this.ball.geometry.dispose()
        this.ball.material.dispose()
        this.exp.scene.remove( this.ball )
        this.exp.renderer.instance.renderLists.dispose()
    }
}
