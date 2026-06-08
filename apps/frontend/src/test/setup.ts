import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
}

Object.assign(global, { TextEncoder, TextDecoder, structuredClone: globalThis.structuredClone });

import 'fake-indexeddb/auto';

if (!global.crypto?.randomUUID) {
  let counter = 0;
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => {
        counter += 1;
        return `00000000-0000-4000-8000-${String(counter).padStart(12, '0')}`;
      },
    },
    configurable: true,
  });
}
