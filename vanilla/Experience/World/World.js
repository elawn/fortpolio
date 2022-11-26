import Experience from '../Experience'
import { Box3, Object3D } from 'three'
import Text from './Text'

export default class World {
    constructor() {
        this.exp = new Experience()
        this.scene = this.exp.scene
        this.cam = this.exp.cam.instance
        this.sizes = this.exp.sizes
        this.widest = null
        this.fovDist = null
        this.updates = []
        this.suffix = this.sizes.isVert ? '_vert' : ''

        this.text0 = new Text( `/objects/text1${this.suffix}.glb`, 0, [], 0, this.sizes.isVert ? 0.175 : 0 )
        this.text1 = new Text( `/objects/text2${this.suffix}.glb`, 1, [
            {
                key: 'sbux',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'https://winners.webbyawards.com/2018/websites-and-mobile-sites/general-websites-and-mobile-sites/corporate-communications/46720/starbucks-channel',
                hoverColor: '#eeeeee'
            },
            {
                key: 'adbe',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'https://winners.webbyawards.com/2019/apps-and-software/mobile-ott-app-features/best-visual-design-aesthetic/80614/adobe-mobile-maturity',
                hoverColor: '#999999'
            },
            {
                key: 'hegg',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'https://www.cssdesignawards.com/sites/happy-egg-co/36835/',
                hoverColor: '#dedede'
            }
        ], 0.1 )
        this.text2 = new Text( `/objects/text3${this.suffix}.glb`, 2, [
            {
                key: 'tbx',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'https://thinkingbox.com/',
                hoverColor: '#ffffff'
            }
        ], -0.1 )
        this.text3 = new Text( `/objects/text4${this.suffix}.glb`, 3, [
            {
                key: 'click',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'mailto:elawn@me.com',
                hoverColor: '#cccccc'
            }
        ] )
    }

    onLoad() {
        this.widest = [
            this.text0.size.x,
            this.text1.size.x,
            this.text2.size.x,
            this.text3.size.x,
        ].reduce( ( prev, curr ) => curr > prev ? curr : prev, 0 )
        this.fovDist = this.cam.position.z - this.text0.size.z / 2

        this.text0.enter( 1 )
        this.setFov()
        this.cam.updateProjectionMatrix()
    }

    setFov() {
        if ( !this.exp.loaded ) return
        // credit to [WestLangley](https://stackoverflow.com/a/14614736) for the next bit
        const x = ( (this.widest + 0.35) / ( this.sizes.width / this.sizes.height ) ) / ( 2 * this.fovDist )
        this.cam.fov = 2 * Math.atan( x ) * ( 180 / Math.PI )
    }

    update() {
        for ( const update of this.updates ) update()
    }
}
