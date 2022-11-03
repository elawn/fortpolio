import Experience from '../Experience'
import { Box3, DefaultLoadingManager, Object3D } from 'three'
import Text from './Text'

export default class World {
    constructor() {
        this.exp = new Experience()
        this.scene = this.exp.scene
        this.gui = this.exp.gui
        this.updates = []

        this.text0 = new Text( '/objects/text1.glb', 0 )
        this.text1 = new Text( '/objects/text2.glb', 1, [
            {
                key: 'sbux',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'https://winners.webbyawards.com/2018/websites-and-mobile-sites/general-websites-and-mobile-sites/corporate-communications/46720/starbucks-channel'
            },
            {
                key: 'adbe',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'https://winners.webbyawards.com/2019/apps-and-software/mobile-ott-app-features/best-visual-design-aesthetic/80614/adobe-mobile-maturity'
            },
            {
                key: 'hegg',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'https://www.cssdesignawards.com/sites/happy-egg-co/36835/'
            }
        ] )
        this.text2 = new Text( '/objects/text3.glb', 2, [
            {
                key: 'tbx',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'https://thinkingbox.com/'
            }
        ] )
        this.text3 = new Text( '/objects/text4.glb', 3, [
            {
                key: 'click',
                children: [],
                box: new Box3(),
                boxObj: new Object3D(),
                url: 'mailto:elawn@me.com'
            }
        ] )
        DefaultLoadingManager.onLoad = () => this.setupTl()
    }

    setupTl() {
        this.text0.enter( 1 )

        this.text1.group.position.x = 0.1
        this.text2.group.position.x = -0.1
    }

    update() {
        for (const update of this.updates) {
            update()
        }
    }
}
