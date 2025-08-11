import type { UsuarioGh, HttpError, RedError } from './github'

export interface UsuarioSuccessDetail {
  data: UsuarioGh
}

export interface UsuarioErrorDetail {
  error: HttpError | RedError
}

export const EVT_USUARIO_SUCCESS = 'usuario-success' as const
export const EVT_USUARIO_ERROR = 'usuario-error' as const