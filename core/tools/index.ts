export * from './types';
export * from './library';

import { registerCoreTools } from './library';

// Inicializar ferramentas core ao importar
registerCoreTools();
