export class IndicadorCarga extends HTMLElement {
  static get observedAttributes() {
    return ['active']
  }

  private root: ShadowRoot

  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
    this.updateAccessibility()
  }

  attributeChangedCallback() {
    this.updateAccessibility()
  }

  get active(): boolean {
    return this.hasAttribute('active')
  }

  set active(value: boolean) {
    if (value) this.setAttribute('active', '')
    else this.removeAttribute('active')
  }

  private render() {
    this.root.innerHTML = `
      <style>
        :host {
          display: grid;
          place-items: center;
          width: 100%;
          margin: .5rem 0;
          color: currentColor;
        }
        :host(:not([active])) { display: none; }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spin 0.5s linear infinite;
        }
        @media (max-width: 480px) {
          .spinner { width: 1.1rem; height: 1.1rem; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .sr-only {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,1px,1px);
          white-space: nowrap; border: 0;
        }
      </style>
      <div class="status" role="status" aria-live="polite" aria-atomic="true">
        <div class="spinner" aria-hidden="true"></div>
        <span class="sr-only">Cargando…</span>
      </div>
    `
  }

  private updateAccessibility() {
    const status = this.root.querySelector('.status')
    if (!status) return
    status.setAttribute('aria-busy', this.active ? 'true' : 'false')
  }
}

if (!customElements.get('indicador-carga')) {
  customElements.define('indicador-carga', IndicadorCarga)
}