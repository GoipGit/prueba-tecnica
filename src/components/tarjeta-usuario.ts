import type { UsuarioGh } from "../types/github";

export class TarjetaUsuario extends HTMLElement {
    private static readonly STYLES = `
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
          width: min(420px, 90%);
          text-align: center;
          margin: 1.25rem auto 0;
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
        @media (max-width: 480px) {
          .tarjeta-usuario { 
            margin-top: 1rem; 
            padding: 1rem; 
            max-width: 341px; 
            margin-left: 0.5rem; 
          }
          .name { font-size: 1.05rem; }
        }
    `;

    private static readonly TEMPLATE = `
        <div class="tarjeta-usuario">
          <img id="avatar" src="" alt="">
          <h2 class="name"></h2>

          <hr>
          <div class="section">
            <div class="label">Biografía:</div>
            <div class="value bio"></div>
          </div>

          <hr>
          <div class="section">
            <div class="label">Cantidad de repositorios públicos:</div>
            <div class="value emph" id="repos"></div>
          </div>

          <hr>
          <div class="section">
            <div class="label">Perfil:</div>
            <div class="value"><a id="profile-link" href="" target="_blank" rel="noopener noreferrer">Ver perfil</a></div>
          </div>
        </div>
    `;

    private _usuario: UsuarioGh | null = null;
    private rendered = false;
    
    private avatarEl!: HTMLImageElement;
    private nameEl!: HTMLElement;
    private bioEl!: HTMLElement;
    private reposEl!: HTMLElement;
    private linkEl!: HTMLAnchorElement;

    get usuario(): UsuarioGh | null {
        return this._usuario;
    }

    set usuario(usuario: UsuarioGh | null) {
        this._usuario = usuario;
        this.updateContent()
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render()
    }

    private render() {
        if (!this.shadowRoot || this.rendered) return;
        
        this.shadowRoot.innerHTML = `
            <style>${TarjetaUsuario.STYLES}</style>
            ${TarjetaUsuario.TEMPLATE}
        `;
        
        this.cacheElements();
        this.rendered = true;
        
        this.updateContent();
    }

    private cacheElements() {
        this.avatarEl = this.shadowRoot!.querySelector('#avatar') as HTMLImageElement;
        this.nameEl = this.shadowRoot!.querySelector('.name') as HTMLElement;
        this.bioEl = this.shadowRoot!.querySelector('.bio') as HTMLElement;
        this.reposEl = this.shadowRoot!.querySelector('#repos') as HTMLElement;
        this.linkEl = this.shadowRoot!.querySelector('#profile-link') as HTMLAnchorElement;
    }

    private updateContent() {
        if (!this.rendered) {
            this.render();
            return;
        }

        const usuario = this._usuario;
        
        if (!usuario) {
            this.shadowRoot!.innerHTML = '';
            this.rendered = false;
            return;
        }

        if (!this.rendered) {
            this.render();
            return;
        }

        this.updateAvatar(usuario);
        this.updateName(usuario);
        this.updateBio(usuario);
        this.updateRepos(usuario);
        this.updateProfileLink(usuario);
    }

    private updateAvatar(usuario: UsuarioGh) {
        this.avatarEl.src = usuario.avatar_url;
        this.avatarEl.alt = `Avatar de ${usuario.name ?? usuario.login}`;
    }

    private updateName(usuario: UsuarioGh) {
        this.nameEl.textContent = usuario.name ?? usuario.login;
    }

    private updateBio(usuario: UsuarioGh) {
        if (usuario.bio) {
            this.bioEl.innerHTML = usuario.bio;
        } else {
            this.bioEl.innerHTML = '<span class="muted">No hay biografía</span>';
        }
    }

    private updateRepos(usuario: UsuarioGh) {
        this.reposEl.textContent = usuario.public_repos.toString();
    }


    private updateProfileLink(usuario: UsuarioGh) {
        this.linkEl.href = usuario.html_url;
    }
}

if (!customElements.get('tarjeta-usuario')) {
    customElements.define('tarjeta-usuario', TarjetaUsuario)
}