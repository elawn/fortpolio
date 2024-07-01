import Experience from '../Experience'
import EventEmitter from '../Utils/EventEmitter'
import paper from 'paper/dist/paper-core'
import gsap from 'gsap'

const ptDiffY = 100
const handleDiffY = 50
const ptTargetX = 50

export default class Curtain extends EventEmitter {
    constructor() {
        super()

        this.exp = new Experience()
        this.sizes = this.exp.sizes
        this.project = paper.setup(document.querySelector('#curtain'))
        this.tool = new paper.Tool()
        this.path = new paper.Path.Rectangle([this.sizes.width, 0], [this.sizes.width, this.sizes.height])
        this.params = {
            midX: this.sizes.width,
            midY: this.sizes.height / 2
        }
        this.segBot
        this.segMid
        this.segTop

        this.start()
        this.tool.onMouseMove = ({point: {y}}) => this.handleMouseMove(y)
        paper.view.onFrame = () => this.handleFrame()
    }

    start() {
        const pt = new paper.Point(this.params.midX, this.params.midY)
        const { segments } = this.path
        paper.view.autoUpdate = true
        this.path.fillColor = 'black'
        this.path.closed = true
        this.path.add(
            new paper.Point(this.sizes.width, this.sizes.height),
            pt.clone().add([0, ptDiffY]),
            pt,
            pt.clone().add([0, -ptDiffY])
        )
        this.path.smooth({ from: segments.length - 3, type: 'continuous' })
        this.segBot = segments[segments.length - 3]
        this.segMid = segments[segments.length - 2]
        this.segTop = segments[segments.length - 1]
        
        this.segTop.handleIn = new paper.Point(0, handleDiffY)
        this.segBot.handleOut = new paper.Point(0, -handleDiffY)
    }

    handleMouseMove(midY) {
        gsap.to(this.params, {
            midY,
            ease: 'power2.out',
            overwrite: true
        })
    }

    handleFrame() {
        this.segBot.y = this.params.midY + ptDiffY
        this.segMid.y = this.params.midY
        this.segMid.x = this.params.midX
        this.segTop.y = this.params.midY - ptDiffY
    }
}
