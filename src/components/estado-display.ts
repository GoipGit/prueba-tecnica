type EstadoTipo = 'info' | 'success' | 'error' | 'empty'
type LiveMode = 'polite' | 'assertive'

export class EstadoDisplay extends HTMLElement {
    static get observedAttributes() {
        return ['type', 'title', 'description', 'icon', 'message']
    }
    
    private root: ShadowRoot
    private wrap!: HTMLElement
    private iconEl!: HTMLElement
    private titleEl!: HTMLElement
    private descEl!: HTMLElement
    private messageEl!: HTMLElement

    constructor() {
        super()
        this.root = this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.render()
        this.updateContent()
    }

    attributeChangedCallback() {
        if (this.root.children.length === 0) {
            this.render()
        }
        this.updateContent()
    }

    get type(): EstadoTipo {
        const value = this.getAttribute('type') as EstadoTipo | null
        return value !== null ? value : 'info'
    }
    
    set type(value: EstadoTipo) {
        this.setAttribute('type', value)
    }

    get title(): string {
        return this.getAttribute('title') ?? ''
    }
    
    set title(value: string) {
        if (value) {
            this.setAttribute('title', value)
        } else {
            this.removeAttribute('title')
        }
    }

    get description(): string {
        return this.getAttribute('description') ?? ''
    }
    
    set description(value: string) {
        if (value) {
            this.setAttribute('description', value)
        } else {
            this.removeAttribute('description')
        }
    }

    get icon(): string {
        return this.getAttribute('icon') ?? ''
    }
    
    set icon(value: string) {
        if (value) {
            this.setAttribute('icon', value)
        } else {
            this.removeAttribute('icon')
        }
    }

    get message(): string {
        return this.getAttribute('message') ?? ''
    }
    
    set message(value: string) {
        if (value) {
            this.setAttribute('message', value)
        } else {
            this.removeAttribute('message')
        }
    }

    get live(): LiveMode {
        const v = this.getAttribute('live') as LiveMode | null
        return v ?? (this.type === 'error' ? 'assertive' : 'polite')
    }
    
    set live(value: LiveMode) {
        this.setAttribute('live', value)
    }

    showMessage(type: EstadoTipo, message: string, live?: LiveMode) {
        this.type = type
        this.message = message
        this.title = ''
        this.description = ''
        this.icon = ''
        if (live) this.live = live
    }

    showState(title: string, description?: string, icon?: string, type: EstadoTipo = 'empty') {
        this.type = type
        this.title = title
        this.description = description || ''
        this.icon = icon || ''
        this.message = ''
    }

    show(options: {
        type?: EstadoTipo,
        title?: string,
        description?: string,
        icon?: string,
        message?: string,
        live?: LiveMode
    }) {
        if (options.type) this.type = options.type
        if (options.title !== undefined) this.title = options.title
        if (options.description !== undefined) this.description = options.description
        if (options.icon !== undefined) this.icon = options.icon
        if (options.message !== undefined) this.message = options.message
        if (options.live) this.live = options.live
    }
    
    clear() {
        this.removeAttribute('title')
        this.removeAttribute('description')
        this.removeAttribute('icon')
        this.removeAttribute('message')
    }

    private render() {
        this.root.innerHTML = `
        <style>
          :host([hidden]) { display: none; }
          
          .wrap {
            display: grid;
            justify-items: center;
            gap: .5rem;
            text-align: center;
            padding: .75rem 1rem;
            border-radius: .5rem;
            font-size: .9rem;
            max-width: min(560px, 100%);
            margin: .5rem auto 0;
          }

          :host([type="info"]) .wrap { 
            background: #e8f0fe; 
            color: #0b316e; 
          }
          :host([type="success"]) .wrap { 
            background: #e6f4ea; 
            color: #0f5132; 
          }
          :host([type="error"]) .wrap { 
            background: #fdecea; 
            color: #842029; 
          }

          :host([type="empty"]) .wrap {
            background: transparent;
            color: var(--empty-fg, rgba(0,0,0,.65));
            padding: 1.25rem;
            border-radius: .75rem;
          }

          .icon {
            font-size: 2rem;
            line-height: 1;
            opacity: .8;
          }

          .title {
            margin: 0;
            font-size: 1.05rem;
            font-weight: 600;
          }

          .description {
            margin: 0;
            font-size: .95rem;
            opacity: .9;
            max-width: 40ch;
          }

          .message {
            margin: 0;
          }

          @media (max-width: 480px) {
            .wrap { 
              padding: 1rem; 
              margin: .25rem auto 0;
            }
          }

          .icon:empty { display: none; }
          .title:empty { display: none; }
          .description:empty { display: none; }
          .message:empty { display: none; }
        </style>
        
        <div class="wrap" role="status" aria-live="polite" aria-atomic="true">
          <div class="icon" aria-hidden="true"></div>
          <h3 class="title"></h3>
          <p class="description"></p>
          <p class="message"></p>
        </div>
        `
        
        this.wrap = this.root.querySelector('.wrap')!
        this.iconEl = this.root.querySelector('.icon')!
        this.titleEl = this.root.querySelector('.title')!
        this.descEl = this.root.querySelector('.description')!
        this.messageEl = this.root.querySelector('.message')!
    }

    private updateContent() {
        if (!this.wrap) return
        
        const type = this.type
        const title = this.title.trim()
        const description = this.description.trim()
        const icon = this.icon.trim()
        const message = this.message.trim()
        const live = type === 'error' ? 'assertive' : this.live

        this.wrap.setAttribute('role', type === 'error' ? 'alert' : 'status')
        this.wrap.setAttribute('aria-live', live)

        this.iconEl.textContent = icon
        this.titleEl.textContent = title
        this.descEl.textContent = description
        this.messageEl.textContent = message

        const hasContent = title || description || message || icon
        this.toggleAttribute('hidden', !hasContent)
    }
}

if (!customElements.get('estado-display')) {
    customElements.define('estado-display', EstadoDisplay)
}