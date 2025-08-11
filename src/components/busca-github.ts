import { fetchUsuarioGh } from '../services/github-service';
import './indicador-carga';
import { EVT_USUARIO_ERROR, EVT_USUARIO_SUCCESS } from '../types/events';
import type { FetchUserResult } from '../types/github';
import './tarjeta-usuario';
import type { TarjetaUsuario } from './tarjeta-usuario'
import './estado-mensaje'
import type { EstadoMensaje } from './estado-mensaje';
import './estado-vacio'
import type { EstadoVacio } from './estado-vacio';

class BuscaGitHub extends HTMLElement {
    private static readonly GH_USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

    private cargando: boolean = false;
    private abortController?: AbortController;
    private form!: HTMLFormElement;
    private input!: HTMLInputElement;
    private boton!: HTMLButtonElement;
    private status!: EstadoMensaje;
    private loader!: HTMLElement;
    private submitHandler: ((e: Event) => void) | undefined;
    private tarjeta!: TarjetaUsuario
    private estadoVacio!: EstadoVacio
    private inputHandler: ((e: Event) => void) | undefined

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render()
        this.cacheRefs()
        this.attachEvents()
    }
    disconnectedCallback() {
        this.abortController?.abort()
        this.detachEvents()
    }
    private render() {
        this.shadowRoot!.innerHTML = `
        <style>
            .form-container {
                display: grid;
                place-items: center;
                gap: 1rem;
            }
            .controls {
                display: flex;
                gap: .5rem;
            }

            #input-main {
                padding: .65rem .8rem;
                border: 1px solid var(--border);
                border-radius: var(--radius);
                background: #fff;
                color: var(--text);
                min-width: 260px;
                box-shadow: var(--shadow);
            }

            #input-main:focus {
                outline: 3px solid color-mix(in srgb, var(--primary) 25%, transparent);
                border-color: var(--primary);
            }

            #boton-main {
                padding: .65rem 1rem;
                border: 1px solid transparent;
                border-radius: var(--radius);
                background: var(--primary);
                color: #fff;
                box-shadow: var(--shadow);
                cursor: pointer;
                transition: background .15s ease, transform .05s ease;
            }

            #boton-main:hover {
                background: var(--primary-600);
            }

            #boton-main:active {
                transform: translateY(1px);
            }

            #boton-main:disabled {
                opacity: .6;
                cursor: not-allowed;
            }
                
        </style>
        <div class="form-container">
            <form id="form-main" class="controls">
                <input type="text" name="usuario" placeholder="Buscar usuario GitHub" id="input-main" autocomplete="off" spellcheck="false" autocapitalize="off" required> 
                <button type="submit" id="boton-main">Buscar</button>
            </form>
        </div>

        <estado-vacio id="vacio" title="Busca usuarios" description="Ingresa un nombre de usuario de GitHub." icon="🔎"></estado-vacio>
        <indicador-carga id="loader"></indicador-carga>
        <tarjeta-usuario id="tarjeta-usuario"></tarjeta-usuario>
        <estado-mensaje id="status"></estado-mensaje>
        `
    }
    private cacheRefs() {
        this.form = this.shadowRoot!.querySelector('#form-main')!;
        this.input = this.shadowRoot!.querySelector('#input-main')!;
        this.boton = this.shadowRoot!.querySelector('#boton-main')!;
        this.loader = this.shadowRoot!.querySelector('#loader')!;
        this.tarjeta = this.shadowRoot!.querySelector('#tarjeta-usuario')! as TarjetaUsuario;
        this.status = this.shadowRoot!.querySelector('#status')! as EstadoMensaje;
        this.estadoVacio = this.shadowRoot!.querySelector('#vacio')! as EstadoVacio;
    }
    private attachEvents() {
        this.submitHandler = (e) => this.onSubmit(e)
        this.form.addEventListener('submit', this.submitHandler)
        this.inputHandler = () => {
            const v = this.input.value.trim()
            this.boton.disabled = this.cargando || v.length === 0
            if (v.length === 0) {
                this.tarjeta.usuario = null
                this.status.clear()
                this.estadoVacio.hidden = false
            }
        }
        this.input.addEventListener('input', this.inputHandler)
        // estado inicial del botón
        this.boton.disabled = this.input.value.trim().length === 0
    }
    private detachEvents() {
        if (this.submitHandler) {
            this.form.removeEventListener('submit', this.submitHandler)
            this.submitHandler = undefined
        }
        if (this.inputHandler) {
            this.input.removeEventListener('input', this.inputHandler)
            this.inputHandler = undefined
        }
    }
    private setLoading(isLoading: boolean) {
        this.cargando = isLoading
        this.boton.disabled = isLoading
        this.input.disabled = isLoading
        this.boton.textContent = isLoading ? 'Buscando...' : 'Buscar'
        if (isLoading) this.form.setAttribute('aria-busy', 'true')
        else this.form.removeAttribute('aria-busy')
        this.loader?.toggleAttribute('active', isLoading)
    }
    private async onSubmit(e: Event) {
        e.preventDefault()
        const usuario = this.input.value.trim()
        if (this.cargando) return
        if (!usuario) {
            this.status.show('error', 'Ingresa un nombre de usuario', 'assertive')
            this.tarjeta.usuario = null
            this.estadoVacio.hidden = false
            this.input.focus(); this.input.select()
            this.boton.disabled = true
            return
        }
        if (!this.isValidUsername(usuario)) {
            this.status.show('error', 'Nombre de usuario inválido')
            this.tarjeta.usuario = null    
            this.estadoVacio.hidden = false      
            this.input.focus()
            this.input.select()
            return
        }

        this.abortController?.abort()
        this.abortController = new AbortController()
        this.tarjeta.usuario = null
        this.estadoVacio.hidden = true
        this.setLoading(true)
        this.status.show('info', 'Buscando…', 'polite')

        try {
            const res = await fetchUsuarioGh(usuario, this.abortController.signal)
            this.handleResult(res)
        } finally {
            this.setLoading(false)
            this.abortController = undefined
        }
    }
    private handleResult(res: FetchUserResult) {
        if (res.ok) {
            console.log('usuario de github:', res.data)
            this.dispatchEvent(new CustomEvent(EVT_USUARIO_SUCCESS, {
                detail: { data: res.data }, bubbles: true, composed: true
            }))
            this.status.clear()
            this.tarjeta.usuario = res.data
            this.estadoVacio.hidden = true
            return
        }

        console.warn('API error:', res)
        this.dispatchEvent(new CustomEvent(EVT_USUARIO_ERROR, {
            detail: { error: res }, bubbles: true, composed: true
        }))
        this.status.show('error',
            res.kind === 'http' ? `Error HTTP ${res.status}: ${res.message ?? ''}` :
                `Error de red: ${res.message}`)
        this.tarjeta.usuario = null
        this.estadoVacio.hidden = false
    }
    private isValidUsername(u: string): boolean {
        return BuscaGitHub.GH_USERNAME_RE.test(u)
    }
}

if (!customElements.get('busca-github')) {
    customElements.define('busca-github', BuscaGitHub);
}