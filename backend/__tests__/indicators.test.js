import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllIndicators, getIndicatorByType, getIndicatorHistory } from '../services/boostrApi.js';

global.fetch = vi.fn();

describe('Indicators Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllIndicators', () => {
    it('should return all economic indicators', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          dolar: { date: '2024-01-13', value: 902.89 },
          euro: { date: '2024-01-13', value: 1000.50 },
          uf: { date: '2024-01-13', value: 36466.69 },
          utm: { date: '2024-01-13', value: 65432.50 },
          ipc: { date: '2024-01-13', value: 125.43 }
        }
      };

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getAllIndicators();

      expect(result.status).toBe('success');
      expect(result.data).toHaveProperty('dolar');
      expect(result.data).toHaveProperty('euro');
      expect(result.data).toHaveProperty('uf');
    });

    it('should call the correct endpoint', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'success', data: {} })
      });

      await getAllIndicators();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/economy/indicators.json'),
        expect.any(Object)
      );
    });
  });

  describe('getIndicatorByType', () => {
    const indicatorTypes = ['dolar', 'euro', 'uf', 'utm', 'ipc'];

    indicatorTypes.forEach(type => {
      it(`should fetch ${type} indicator`, async () => {
        const mockResponse = {
          status: 'success',
          data: { date: '2024-01-13', value: 1000 }
        };

        global.fetch.mockResolvedValueOnce({
          json: () => Promise.resolve(mockResponse)
        });

        const result = await getIndicatorByType(type);

        expect(result.status).toBe('success');
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining(`/economy/indicator/${type}.json`),
          expect.any(Object)
        );
      });
    });

    it('should convert type to lowercase', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'success', data: {} })
      });

      await getIndicatorByType('DOLAR');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/economy/indicator/dolar.json'),
        expect.any(Object)
      );
    });
  });

  describe('getIndicatorHistory', () => {
    it('should fetch historical data for an indicator', async () => {
      const mockResponse = {
        status: 'success',
        data: [
          { date: '2024-01-01', value: 900 },
          { date: '2024-01-02', value: 902 }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getIndicatorHistory('dolar', 2024);

      expect(result.status).toBe('success');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/economy/indicator/dolar/2024.json'),
        expect.any(Object)
      );
    });
  });
});
