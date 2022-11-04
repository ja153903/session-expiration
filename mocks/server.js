const { setupServer } = require('msw/node');
import { handlers } from './handlers';

export const server = setupServer(...handlers);
