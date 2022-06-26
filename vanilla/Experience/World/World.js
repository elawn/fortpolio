import Experience from '../Experience'
import { DefaultLoadingManager } from 'three'
import Text from './Text'

export default class World {
    constructor() {
        this.exp = new Experience()
        this.scene = this.exp.scene
        this.gui = this.exp.gui

        this.text0 = new Text('/objects/text1.glb', 0)
        this.text1 = new Text('/objects/text2.glb', 1)
        this.text2 = new Text('/objects/text3.glb', 2)
        this.text3 = new Text('/objects/text4.glb', 3)
        DefaultLoadingManager.onLoad = () => this.setupTl()
    }

    setupTl() {
        this.text0.enter(1)

        this.text1.group.position.x = 0.1
        this.text2.group.position.x = -0.1
    }
}
