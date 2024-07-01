import Experience from '../Experience'
import EventEmitter from './EventEmitter'

export default class Router extends EventEmitter {
    constructor() {
        super()
        this.exp = new Experience()
        this.state = history.state || { page: 'home' }
        this.waybackModal = document.querySelector('#wayback-modal')
        this.waybackBtn = this.waybackModal.querySelector('a')

        window.addEventListener('popstate', ({state}) => this.handlePopState(state))
    }

    handlePopState(state) {
        this.state = state
        this.trigger('pageChange', [state.page])
    }

    handleWaybackModal(url) {
        this.waybackModal.classList.add('show')
        this.waybackBtn.href = url
        // TODO: add modal close handlers
    }

    to(dest) {
        if (dest.includes('web.archive.org')) {
            this.handleWaybackModal()
            return
        }
        if (['http', 'mailto:'].some(s => dest.startsWith(s))) {
            window.open(dest, '_blank')
            return
        }
        const [_, page] = dest.split('/')
        history.pushState({page}, page, `#${dest}`)
        this.handlePopState({page})
    }
}