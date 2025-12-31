import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Se estiver em desenvolvimento local, permite tudo (para facilitar)
    // Mude para false se quiser testar o login localmente
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) return NextResponse.next();

    // Proteger rotas de dashboard e council
    if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/council')) {
        const basicAuth = request.headers.get('authorization');

        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            // ⚠️ MUDE ISSO EM PRODUÇÃO: Definir variáveis de ambiente ADMIN_USER e ADMIN_PASS
            const validUser = process.env.ADMIN_USER || 'admin';
            const validPass = process.env.ADMIN_PASS || 'lx2025';

            if (user === validUser && pwd === validPass) {
                return NextResponse.next();
            }
        }

        return new NextResponse('Autenticação Necessária', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Dashboard"',
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/council/:path*'],
};
