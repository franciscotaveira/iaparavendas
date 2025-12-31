// ============================================
// QR CODE PAGE - EVOLUTION API CONNECTION
// ============================================
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const instanceName = request.nextUrl.searchParams.get('instance') || 'lx-test';
    const apiKey = process.env.EVOLUTION_API_KEY || 'lx-evolution-secret-key-2024';
    const baseUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';

    try {
        // Buscar QR Code
        const response = await fetch(`${baseUrl}/instance/connect/${instanceName}`, {
            headers: { 'apikey': apiKey }
        });

        if (!response.ok) {
            return new NextResponse(renderHTML('Erro ao buscar QR Code', null, 'error'), {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        const data = await response.json();

        // Verificar se está conectado
        const statusRes = await fetch(`${baseUrl}/instance/connectionState/${instanceName}`, {
            headers: { 'apikey': apiKey }
        });
        const statusData = await statusRes.json();

        if (statusData.state === 'open') {
            return new NextResponse(renderHTML('WhatsApp Conectado!', null, 'connected'), {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        return new NextResponse(renderHTML(`Conectar WhatsApp: ${instanceName}`, data.base64, 'qrcode'), {
            headers: { 'Content-Type': 'text/html' }
        });

    } catch (error: any) {
        return new NextResponse(renderHTML(`Erro: ${error.message}`, null, 'error'), {
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

function renderHTML(title: string, qrBase64: string | null, status: string): string {
    const statusColors: Record<string, string> = {
        'connected': '#10b981',
        'qrcode': '#3b82f6',
        'error': '#ef4444'
    };

    const statusIcons: Record<string, string> = {
        'connected': '✅',
        'qrcode': '📱',
        'error': '❌'
    };

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - LX Agent</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            padding: 48px;
            text-align: center;
            max-width: 500px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .icon {
            font-size: 64px;
            margin-bottom: 24px;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 16px;
            color: ${statusColors[status]};
        }
        .qrcode {
            background: white;
            padding: 16px;
            border-radius: 16px;
            margin: 24px 0;
            display: inline-block;
        }
        .qrcode img {
            max-width: 280px;
            height: auto;
        }
        .instructions {
            color: rgba(255,255,255,0.7);
            font-size: 14px;
            line-height: 1.6;
        }
        .instructions ol {
            text-align: left;
            margin-top: 16px;
            padding-left: 20px;
        }
        .refresh {
            margin-top: 24px;
            padding: 12px 24px;
            background: ${statusColors[status]};
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .refresh:hover {
            opacity: 0.9;
        }
        .status-badge {
            background: ${statusColors[status]};
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
            display: inline-block;
        }
    </style>
    ${status === 'qrcode' ? '<meta http-equiv="refresh" content="10">' : ''}
</head>
<body>
    <div class="container">
        <div class="icon">${statusIcons[status]}</div>
        <div class="status-badge">${status === 'connected' ? 'Conectado' : status === 'qrcode' ? 'Aguardando Scan' : 'Erro'}</div>
        <h1>${title}</h1>
        
        ${qrBase64 ? `
            <div class="qrcode">
                <img src="${qrBase64}" alt="QR Code WhatsApp">
            </div>
            <div class="instructions">
                <ol>
                    <li>Abra o WhatsApp no seu celular</li>
                    <li>Vá em Configurações > Dispositivos Conectados</li>
                    <li>Clique em "Conectar Dispositivo"</li>
                    <li>Escaneie este QR Code</li>
                </ol>
            </div>
        ` : ''}
        
        ${status === 'connected' ? `
            <p style="color: rgba(255,255,255,0.7); margin-top: 16px;">
                O WhatsApp está conectado e pronto para receber mensagens!
            </p>
        ` : ''}
        
        <a href="?instance=lx-test&t=${Date.now()}" class="refresh">
            ${status === 'connected' ? 'Verificar Status' : 'Atualizar QR Code'}
        </a>
    </div>
</body>
</html>
    `.trim();
}
