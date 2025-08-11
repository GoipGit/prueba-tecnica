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
    name: 'Test User',
    bio: 'Test bio description',
    public_repos: 42,
    avatar_url: 'https://example.com/avatar.jpg',
    html_url: 'https://github.com/testuser'
  }

  it('should render user data correctly', () => {
    element.usuario = mockUser

    const shadowRoot = element.shadowRoot!
    expect(shadowRoot.querySelector('#avatar')).toHaveAttribute('src', mockUser.avatar_url)
    expect(shadowRoot.querySelector('.name')).toHaveTextContent('Test User')
    expect(shadowRoot.querySelector('.bio')).toHaveTextContent('Test bio description')
    expect(shadowRoot.querySelector('.value.emph')).toHaveTextContent('42')
    expect(shadowRoot.querySelector('a')).toHaveAttribute('href', mockUser.html_url)
  })

  it('should handle user without name (fallback to login)', () => {
    const userWithoutName = { ...mockUser, name: null }
    element.usuario = userWithoutName

    expect(element.shadowRoot?.querySelector('.name')).toHaveTextContent('testuser')
  })

  it('should handle user without bio', () => {
    const userWithoutBio = { ...mockUser, bio: null }
    element.usuario = userWithoutBio

    expect(element.shadowRoot?.querySelector('.bio')).toContainHTML('<span class="muted">No hay biografía</span>')
  })

  it('should clear content when user is null', () => {
    element.usuario = mockUser
    expect(element.shadowRoot?.innerHTML).toContain('tarjeta-usuario')

    element.usuario = null
    expect(element.shadowRoot?.innerHTML).toBe('')
  })
})
