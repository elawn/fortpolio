import Experience from '../Experience'
import EventEmitter from './EventEmitter'

export default class Router extends EventEmitter {
    constructor() {
        super()
        this.exp = new Experience()
        this.state = history.state || { page: 'home' }

        window.addEventListener('popstate', ({state}) => this.handlePopState(state))
    }

    handlePopState(state) {
        this.state = state
        this.trigger('pageChange', [state.page])
    }

    to(dest) {
        if (dest.startsWith('http')) {
            window.open(dest, '_blank')
            return
        }
        const [_, page] = dest.split('/')
        history.pushState({page}, page, `#${dest}`)
        this.handlePopState({page})
    }
}