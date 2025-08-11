import type { FetchUserResult, UsuarioGh } from '../types/github';

export async function fetchUsuarioGh(usuario: string, signal?: AbortSignal): Promise<FetchUserResult> {
    const url = `https://api.github.com/users/${encodeURIComponent(usuario)}`;
    const headers = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': `2022-11-28`
    }
    try {
        const r = await fetch(url, { headers, signal });
        if (!r.ok) {
            switch (r.status) {
                case 404:
                    return { ok: false, kind: 'http', status: 404, message: 'Usuario no encontrado' };
                case 403:
                    const remaining = r.headers.get('x-ratelimit-remaining')
                    const reset = r.headers.get('x-ratelimit-reset')
                    return { ok: false, kind: 'http', status: 403, message: 'Límite de solicitudes excedido', remaining, reset };
                case 429:
                    return { ok: false, kind: 'http', status: 429, message: 'Límite de solicitudes excedido' };
                default:
                    return { ok: false, kind: 'http', status: r.status, message: 'Error al buscar el usuario' };
            }
        }else {
            const data: UsuarioGh = await r.json();
            return { ok: true, data };
        }
    } catch (err) {
        if ((err as any).name === 'AbortError') {
            return { ok: false, kind: 'network', message: 'Búsqueda cancelada' };
        }
        return { ok: false, kind: 'network', message: 'Error al buscar el usuario' };
    }
}