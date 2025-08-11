export class EstadoVacio extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'description', 'icon']
    }

    private root: ShadowRoot
    private wrap!: HTMLElement
    private titulo!: HTMLElement
    private desc!: HTMLElement
    private icono!: HTMLElement

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

    get title(): string { return this.getAttribute('title') ?? '' }
    set title(v: string) { this.setAttribute('title', v) }

    get description(): string { return this.getAttribute('description') ?? '' }
    set description(v: string) { this.setAttribute('description', v) }

    get icon(): string { return this.getAttribute('icon') ?? '' }
    set icon(v: string) { this.setAttribute('icon', v) }

    show(title: string, description: string, icon?: string) {
        this.title = title
        this.description = description
        if (icon != null) this.icon = icon
    }

    clear() {
        this.removeAttribute('title')
        this.removeAttribute('description')
        this.removeAttribute('icon')
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
              padding: 1.25rem;
              border-radius: .75rem;
              color: var(--empty-fg, rgba(0,0,0,.65));
              background: var(--empty-bg, transparent);
              width: min(560px, 100%);
              margin: .5rem auto 0;
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
            .desc {
              margin: 0;
              font-size: .95rem;
              opacity: .9;
              max-width: 40ch;
            }
            @media (max-width: 480px) {
              .wrap { padding: 1rem; }
            }
          </style>
          <div class="wrap" role="status" aria-live="polite" aria-atomic="true">
            <div class="icon" aria-hidden="true"></div>
            <h3 class="title"></h3>
            <p class="desc"></p>
          </div>
        `
        this.wrap = this.root.querySelector('.wrap') as HTMLElement
        this.icono = this.root.querySelector('.icon') as HTMLElement
        this.titulo = this.root.querySelector('.title') as HTMLElement
        this.desc = this.root.querySelector('.desc') as HTMLElement
    }

    private update() {
        const title = this.title.trim()
        const desc = this.description.trim()
        const icon = this.icon.trim()

        this.titulo.textContent = title
        this.desc.textContent = desc

        if (icon) {
            this.icono.textContent = icon
            this.icono.removeAttribute('hidden')
        } else {
            this.icono.textContent = ''
            this.icono.setAttribute('hidden', '')
        }

        const empty = title.length === 0 && desc.length === 0
        this.toggleAttribute('hidden', empty)
    }
}

if (!customElements.get('estado-vacio')) {
    customElements.define('estado-vacio', EstadoVacio)
}