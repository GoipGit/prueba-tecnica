import '../components/tarjeta-usuario'
import type { TarjetaUsuario } from '../components/tarjeta-usuario'
import type { UsuarioGh } from '../types/github'

describe('TarjetaUsuario Component', () => {
  let element: TarjetaUsuario

  beforeEach(() => {
    element = document.createElement('tarjeta-usuario') as TarjetaUsuario
    document.body.appendChild(element)
  })

  afterEach(() => {
    document.body.removeChild(element)
  })

  const mockUser: UsuarioGh = {
    login: 'testuser',
    name: 'Test Pablo',
    bio: 'Pablito clavó un clavito en la calva de un calvito. Un clavito clavó Pablito en la calva de un calvito. ¿Qué clavito clavó Pablito?',
    public_repos: 42,
    avatar_url: 'https://example.com/avatar.jpg',
    html_url: 'https://github.com/testuser'
  }

  it('render correcto de datos del usuario', () => {
    element.usuario = mockUser

    const shadowRoot = element.shadowRoot!
    expect(shadowRoot.querySelector('#avatar')).toHaveAttribute('src', mockUser.avatar_url)
    expect(shadowRoot.querySelector('.name')).toHaveTextContent(mockUser.name!)
    expect(shadowRoot.querySelector('.bio')).toHaveTextContent(mockUser.bio!)
    expect(shadowRoot.querySelector('.value.emph')).toHaveTextContent('42')
    expect(shadowRoot.querySelector('a')).toHaveAttribute('href', mockUser.html_url)
  })

  it('maneja usuario sin nombre (fallback a login)', () => {
    const userWithoutName = { ...mockUser, name: null }
    element.usuario = userWithoutName

    expect(element.shadowRoot?.querySelector('.name')).toHaveTextContent('testuser')
  })

  it('maneja usuario sin biografía', () => {
    const userWithoutBio = { ...mockUser, bio: null }
    element.usuario = userWithoutBio

    expect(element.shadowRoot?.querySelector('.bio')).toContainHTML('<span class="muted">No hay biografía</span>')
  })

  it('limpia contenido cuando el usuario es null', () => {
    element.usuario = mockUser
    expect(element.shadowRoot?.innerHTML).toContain('tarjeta-usuario')

    element.usuario = null
    expect(element.shadowRoot?.innerHTML).toBe('')
  })
})
