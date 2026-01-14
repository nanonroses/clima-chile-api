import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRecentEarthquakes } from '../services/boostrApi.js';

global.fetch = vi.fn();

describe('Earthquakes Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRecentEarthquakes', () => {
    it('should return recent earthquakes', async () => {
      const mockResponse = {
        status: 'success',
        data: [
          {
            date: '2024-01-13 15:30:00',
            magnitude: '5.2',
            location: '50 km al NE de Arica',
            latitude: '-18.5',
            longitude: '-70.2',
            depth: '120'
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getRecentEarthquakes();

      expect(result.status).toBe('success');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('magnitude');
      expect(result.data[0]).toHaveProperty('location');
    });

    it('should handle API errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API unavailable'));

      await expect(getRecentEarthquakes()).rejects.toThrow('API unavailable');
    });

    it('should call the correct endpoint', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'success', data: [] })
      });

      await getRecentEarthquakes();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/earthquakes/recent.json'),
        expect.any(Object)
      );
    });
  });
});
