# ANTIGRAVITY DASHBOARD ASSETS

Este diretório contém os componentes React/TypeScript para o seu novo Dashboard Visual.
Eles foram projetados para serem **"Instagramáveis"** e **"Vivos"**, perfeitos para o seu posicionamento.

## CONTEÚDO

1. **`HeartbeatMonitor.tsx`**: O monitor cardíaco estilo ECG verde neon.
    * *Uso*: Mostra que o sistema está vivo.
2. **`DojoArena.tsx`**: A arena estilo Street Fighter/Pokémon.
    * *Uso*: Mostra seus agentes evoluindo/discutindo.
3. **`AntigravityDashboard.tsx`**: O layout principal.
    * *Feature Secreta*: Botão **REC_MODE** (Insta-Mode). Quando você clica, ele esconde dados sensíveis e deixa a tela pronta para gravar Stories.

## COMO INSTALAR NO SEU PROJETO NEXT.JS/REACT

1. Copie a pasta `Antigravity_Dashboard_Assets` para dentro da sua pasta `src/components` (ou onde você guarda componentes).
2. Instale dependências se não tiver (provavelmente já tem):
    * `react`
    * `lucide-react` (opcional, se quiser ícones)
    * `tailwindcss` (os estilos usam classes tailwind padrão)
3. Crie uma nova página (ex: `app/antigravity/page.tsx`) e importe o Dashboard:

```tsx
import { AntigravityDashboard } from '@/components/Antigravity_Dashboard_Assets/AntigravityDashboard';

export default function Page() {
  return <AntigravityDashboard />;
}
```

## COMO USAR PARA CONTEÚDO

1. Abra a página `/antigravity`.
2. Clique no botão **REC_MODE [OFF]** para ligar o modo de gravação.
3. Aperte REC no celular.
4. Fale: *"Olha a evolução acontecendo enquanto eu tomo café. O agente Hunter acabou de vencer o argumento sobre preço."*
5. Poste.

**Dica de Estilização**: Certifique-se de que seu `tailwind.config.js` permite cores customizadas ou apenas use as cores padrão que já configurei (zinc, green-500, red-500).
