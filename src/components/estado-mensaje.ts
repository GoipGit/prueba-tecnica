type EstadoTipo = 'info' | 'success' | 'error'
type LiveMode = 'polite' | 'assertive'

export class EstadoMensaje extends HTMLElement {
    static get observedAttributes() {
        return ['type', 'message', 'live']
    }

    private root: ShadowRoot
    private wrap!: HTMLElement
    private text!: HTMLElement

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
        this.render()
        this.update()
    }
    attributeChangedCallback() {
        if (!this.wrap) this.render()
        this.update()
    }
    get type(): EstadoTipo { return (this.getAttribute('type') as EstadoTipo) ?? 'info' }
    set type(v: EstadoTipo) { this.setAttribute('type', v) }
  
    get live(): LiveMode {
      const v = this.getAttribute('live') as LiveMode | null
      return v ?? (this.type === 'error' ? 'assertive' : 'polite')
    }
    set live(v: LiveMode) { this.setAttribute('live', v) }
  
    get message(): string { return this.getAttribute('message') ?? '' }
    set message(v: string) { this.setAttribute('message', v) }

    show(type: EstadoTipo, message: string, live?: LiveMode) {
        this.type = type
        this.message = message
        if (live) this.live = live
    }
    clear() {
        this.removeAttribute('message')
    }
    private render() {
        this.root.innerHTML = `
        <style>
          :host([hidden]) { display: none; }
          .wrap { padding: .75rem 1rem; border-radius: .5rem; font-size: .9rem; max-width: min(560px, 100%); margin: .5rem auto 0; }
          :host([type="info"]) .wrap { background: #e8f0fe; color: #0b316e; }
          :host([type="success"]) .wrap { background: #e6f4ea; color: #0f5132; }
          :host([type="error"]) .wrap { background: #fdecea; color: #842029; }
        </style>
        <div class="wrap" role="status" aria-live="polite" aria-atomic="true">
          <span class="text"></span>
        </div>
      `
        this.wrap = this.root.querySelector('.wrap') as HTMLElement
        this.text = this.root.querySelector('.text') as HTMLElement
    }

    private update() {
        const msg = this.message.trim()
        const type = this.type
        const live = type === 'error' ? 'assertive' : this.live

        this.wrap.setAttribute('role', type === 'error' ? 'alert' : 'status')
        this.wrap.setAttribute('aria-live', live)

        this.text.textContent = msg
        this.toggleAttribute('hidden', msg.length === 0)
    }
}

if (!customElements.get('estado-mensaje')) {
    customElements.define('estado-mensaje', EstadoMensaje)
}