import '@testing-library/jest-dom';

// Mock para fetch global
global.fetch = vi.fn();

// Limpiar mocks después de cada test
afterEach(() => {
  vi.clearAllMocks();
});
