import Experience from '../Experience'
import { Body, Circle } from 'p2'
import { Mesh, MeshMatcapMaterial, SphereGeometry } from 'three'
import { matcaps } from '../Utils/Materials'
import { gsap } from 'gsap'

export default class Ball {
    constructor( y, side ) {
        this.exp = new Experience()
        this.y = y
        this.side = side
        this.minRad = 0.045
        this.maxRad = 0.12
        this.rad = Math.min( Math.random() * this.maxRad + this.minRad, this.maxRad )
        this.fadingOut = false

        this.makePhys()
        this.makeBall()

        this.exp.world.balls[ this.ball.uuid ] = this
    }

    makePhys() {
        const xVelocity = Math.min(Math.random() * 0.15 + 0.06, 0.15)
        this.physBall = new Body( {
            position: [
                this.side === 'left' ? -1.25 : 1.25,
                this.y
            ],
            mass: (this.rad / this.maxRad) * 5,
            velocity: [ this.side === 'left' ? xVelocity : -xVelocity, 0 ],
            angularVelocity: this.side === 'left' ? 1 : -1
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
        // this.ball.rotation.z = this.physBall.angle
        this.ball.rotation.z += 0.1
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
