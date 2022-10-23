import Experience from './Experience'
import { ACESFilmicToneMapping, PCFSoftShadowMap, sRGBEncoding, WebGLRenderer } from 'three'

export default class Renderer {
    constructor() {
        this.exp = new Experience()
        this.cvs = this.exp.cvs
        this.sizes = this.exp.sizes
        this.scene = this.exp.scene
        this.cam = this.exp.cam

        this.setInstance()
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    setInstance() {
        this.instance = new WebGLRenderer({
            canvas: this.cvs,
            antialias: true
        })
        this.instance.physicallyCorrectLights = true
        this.instance.outputEncoding = sRGBEncoding
        this.instance.toneMapping = ACESFilmicToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = PCFSoftShadowMap
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setClearColor( '#0080ff' )
    }

    update() {
        this.instance.render(this.scene, this.cam.instance)
    }
}
