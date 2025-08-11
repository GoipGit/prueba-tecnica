export interface UsuarioGh {
    login: string
    name: string | null
    bio: string | null
    public_repos: number
    avatar_url: string
    html_url: string
}

export interface ResultadoOk {
    ok: true
    data: UsuarioGh
}

export interface HttpError {
    ok: false
    kind: 'http'
    status: number
    message?: string
    remaining?: string | null
    reset?: string | null
}

export interface RedError {
    ok: false
    kind: 'network'
    message: string
}

export type FetchUserResult = ResultadoOk | HttpError | RedError;