/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COLYSEUS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { ThreeElements } from '@react-three/fiber'

declare global {
    namespace React {
        namespace JSX {
            // eslint-disable-next-line @typescript-eslint/no-empty-object-type
            interface IntrinsicElements extends ThreeElements {
            }
        }
    }
}