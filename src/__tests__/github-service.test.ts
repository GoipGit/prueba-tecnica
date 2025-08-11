import { fetchUsuarioGh } from '../services/github-service'
import type { UsuarioGh } from '../types/github'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('GitHub Service', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  const mockUser: UsuarioGh = {
    login: 'octocat',
    name: 'The Octocat',
    bio: 'GitHub mascot',
    public_repos: 8,
    avatar_url: 'https://github.com/images/error/octocat_happy.gif',
    html_url: 'https://github.com/octocat'
  }

  it('should return user data on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockUser,
      headers: new Map()
    })

    const result = await fetchUsuarioGh('octocat')

    expect(result).toEqual({
      ok: true,
      data: mockUser
    })
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/users/octocat',
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        signal: undefined
      }
    )
  })

  it('should handle 404 error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Map()
    })

    const result = await fetchUsuarioGh('nonexistent')

    expect(result).toEqual({
      ok: false,
      kind: 'http',
      status: 404,
      message: 'Usuario no encontrado'
    })
  })

  it('should handle 403 rate limit with headers', async () => {
    const mockHeaders = new Map([
      ['x-ratelimit-remaining', '0'],
      ['x-ratelimit-reset', '1640995200']
    ])
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      headers: mockHeaders
    })

    const result = await fetchUsuarioGh('user')

    expect(result).toEqual({
      ok: false,
      kind: 'http',
      status: 403,
      message: 'Límite de solicitudes excedido',
      remaining: '0',
      reset: '1640995200'
    })
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await fetchUsuarioGh('user')

    expect(result).toEqual({
      ok: false,
      kind: 'network',
      message: 'Error al buscar el usuario'
    })
  })

  it('should handle abort signal', async () => {
    const abortError = new Error('Aborted')
    abortError.name = 'AbortError'
    mockFetch.mockRejectedValueOnce(abortError)

    const result = await fetchUsuarioGh('user', new AbortController().signal)

    expect(result).toEqual({
      ok: false,
      kind: 'network',
      message: 'Búsqueda cancelada'
    })
  })
})