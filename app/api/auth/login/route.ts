import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const correctPassword = process.env.DASHBOARD_PASSWORD || 'admin123';

        if (password === correctPassword) {
            // Create a simple session token
            const sessionToken = Buffer.from(`lx-session-${Date.now()}`).toString('base64');

            const response = NextResponse.json({ success: true });

            // Set cookie for 7 days
            response.cookies.set('lx_session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 });
    }
}
