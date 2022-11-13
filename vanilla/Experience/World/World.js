import Experience from '../Experience'
import { Box3, DefaultLoadingManager, Object3D } from 'three'
import Text from './Text'

export default class World {
    constructor() {
        this.exp = new Experience()
        this.scene = this.exp.scene
        this.cam = this.exp.cam.instance
        this.sizes = this.exp.sizes
        this.gui = this.exp.gui
        this.widest = null
        this.fovDist = null
        this.updates = []

        this.text0 = new Text( '/objects/text1.glb', 0 )
        this.text1 = new Text( '/objects/text2.glb', 1, [
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
        ] )
        this.text2 = new Text( '/objects/text3.glb', 2, [
            {
                key: 'tbx',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'https://thinkingbox.com/',
                hoverColor: '#ffffff'
            }
        ] )
        this.text3 = new Text( '/objects/text4.glb', 3, [
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

        this.setupTl()
        this.setFov()
        this.cam.updateProjectionMatrix()
    }

    setupTl() {
        this.text0.enter( 1 )

        this.text1.group.position.x = 0.1
        this.text2.group.position.x = -0.1
    }

    setFov() {
        if ( !this.exp.loaded ) return
        // credit to [WestLangley](https://stackoverflow.com/a/14614736) for the next bit
        const x = ( (this.widest + 0.35) / ( this.sizes.width / this.sizes.height ) ) / ( 2 * this.fovDist )
        this.cam.fov = 2 * Math.atan( x ) * ( 180 / Math.PI )
    }

    update() {
        for ( const update of this.updates ) {
            update()
        }
    }
}
