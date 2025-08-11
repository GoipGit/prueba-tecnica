import type { UsuarioGh } from "../types/github";

export class TarjetaUsuario extends HTMLElement {

    private _usuario: UsuarioGh | null = null;

    get usuario(): UsuarioGh | null {
        return this._usuario;
    }

    set usuario(usuario: UsuarioGh | null) {
        this._usuario = usuario;
        this.render()
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render()
    }
    render() {
        if (!this.shadowRoot) return;
        const usuario = this._usuario;
        if (!usuario) {
            this.shadowRoot!.innerHTML = ``
            return
        } else {
            this.shadowRoot!.innerHTML = `
            <style>
                :host {
                  --card-bg: var(--surface, #fff);
                  --card-fg: var(--text, currentColor);
                  --card-radius: var(--radius, 12px);
                  --card-gap: var(--gap, 0.75rem);
                  --card-pad: var(--card-padding, 1rem);
                  --card-border: var(--card-border, 1px solid rgba(0,0,0,0.1));
                  --card-shadow: var(--shadow, 0 6px 14px rgba(0,0,0,0.08));

                  color: var(--card-fg);
                  display: block;
                }

                .tarjeta-usuario {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: var(--card-gap);
                  padding: calc(var(--card-pad) + .25rem);
                  border-radius: var(--card-radius);
                  border: var(--card-border);
                  box-shadow: var(--card-shadow);
                  background-color: var(--card-bg);
                  max-width: 420px;
                  text-align: center;
                  margin: 1.25rem auto 0; /* separa la tarjeta del input */
                }

                #avatar {
                  width: clamp(72px, 12vw, 96px);
                  height: clamp(72px, 12vw, 96px);
                  border-radius: 50%;
                  object-fit: cover;
                }

                :host([compact]) #avatar {
                  width: 48px;
                  height: 48px;
                }

                .name {
                  margin: .25rem 0 0;
                  font-size: 1.15rem;
                  font-weight: 700;
                }

                .section { width: 100%; }
                .label {
                  font-size: .85rem;
                  text-transform: uppercase;
                  letter-spacing: .02em;
                  opacity: .8;
                }
                .value { margin-top: .25rem; }
                .value.emph { font-weight: 600; }
                .muted { opacity: .7; font-style: italic; }
                .bio {
                  display: -webkit-box;
                  -webkit-line-clamp: 3;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  overflow-wrap: anywhere;
                  word-break: break-word;
                }

                hr {
                  width: 100%;
                  height: 1px;
                  border: none;
                  background: rgba(0,0,0,.08);
                  margin: .5rem 0;
                }

                a {
                  color: inherit;
                  text-decoration: underline;
                  outline-offset: 3px;
                }
            </style>
            <div class="tarjeta-usuario">
              <img id="avatar" src="${usuario.avatar_url}" alt="Avatar de ${usuario.name ?? usuario.login}">
              <h2 class="name">${usuario.name ?? usuario.login}</h2>

              <hr>
              <div class="section">
                <div class="label">Biografía:</div>
                <div class="value bio">${usuario.bio ? usuario.bio : '<span class="muted">No hay biografía</span>'}</div>
              </div>

              <hr>
              <div class="section">
                <div class="label">Cantidad de repositorios públicos:</div>
                <div class="value emph">${usuario.public_repos}</div>
              </div>

              <hr>
              <div class="section">
                <div class="label">Perfil:</div>
                <div class="value"><a href="${usuario.html_url}" target="_blank" rel="noopener noreferrer">Ver perfil</a></div>
              </div>
            </div>
            `
        }

    }
}

if (!customElements.get('tarjeta-usuario')) {
    customElements.define('tarjeta-usuario', TarjetaUsuario)
}