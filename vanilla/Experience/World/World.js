import Experience from '../Experience'
import { BoxGeometry, DefaultLoadingManager, Mesh, MeshBasicMaterial } from 'three'
import Text from './Text'

export default class World {
    constructor() {
        this.exp = new Experience()
        this.scene = this.exp.scene

        this.text1 = new Text('/objects/text1.glb')
        DefaultLoadingManager.onLoad = () => this.setupTl()
    }

    setupTl() {
        this.text1.enter(1)
    }
}
