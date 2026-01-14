import { describe, it, expect, vi, beforeEach } from 'vitest';
import { STATIONS, getAllWeather, getWeatherByCode } from '../services/boostrApi.js';

// Mock de fetch global
global.fetch = vi.fn();

describe('Weather Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('STATIONS', () => {
    it('should have 25 weather stations', () => {
      expect(STATIONS).toHaveLength(25);
    });

    it('should include Santiago station', () => {
      const santiago = STATIONS.find(s => s.code === 'SCQN');
      expect(santiago).toBeDefined();
      expect(santiago.city).toBe('Santiago');
      expect(santiago.region).toBe('Metropolitana');
    });

    it('should have unique station codes', () => {
      const codes = STATIONS.map(s => s.code);
      const uniqueCodes = [...new Set(codes)];
      expect(codes).toHaveLength(uniqueCodes.length);
    });

    it('should have all required fields for each station', () => {
      STATIONS.forEach(station => {
        expect(station).toHaveProperty('code');
        expect(station).toHaveProperty('city');
        expect(station).toHaveProperty('region');
      });
    });
  });

  describe('getAllWeather', () => {
    it('should return weather data for all stations', async () => {
      const mockResponse = {
        status: 'success',
        data: [
          { code: 'SCQN', city: 'Santiago Centro', temperature: '25', condition: 'Despejado', humidity: '30' }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getAllWeather();

      expect(result.status).toBe('success');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('region');
    });

    it('should handle API errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getAllWeather()).rejects.toThrow();
    });
  });

  describe('getWeatherByCode', () => {
    it('should return weather for a specific station', async () => {
      const mockResponse = {
        status: 'success',
        data: { code: 'SCQN', city: 'Santiago Centro', temperature: '25' }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getWeatherByCode('SCQN');

      expect(result.status).toBe('success');
      expect(result.data[0].code).toBe('SCQN');
    });

    it('should convert code to uppercase', async () => {
      const mockResponse = {
        status: 'success',
        data: { code: 'SCQN', city: 'Santiago Centro' }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await getWeatherByCode('scqn');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('SCQN'),
        expect.any(Object)
      );
    });
  });
});
