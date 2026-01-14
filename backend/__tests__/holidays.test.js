import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllHolidays, checkIfHoliday } from '../services/boostrApi.js';

global.fetch = vi.fn();

describe('Holidays Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllHolidays', () => {
    it('should return all holidays for current year', async () => {
      const mockResponse = {
        status: 'success',
        data: [
          { date: '2024-01-01', title: 'Año Nuevo', type: 'Civil', inalienable: true },
          { date: '2024-05-01', title: 'Día del Trabajo', type: 'Civil', inalienable: true }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getAllHolidays();

      expect(result.status).toBe('success');
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]).toHaveProperty('title');
      expect(result.data[0]).toHaveProperty('date');
    });

    it('should fetch holidays for a specific year', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'success', data: [] })
      });

      await getAllHolidays(2025);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/holidays/2025.json'),
        expect.any(Object)
      );
    });

    it('should fetch current year when no year provided', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'success', data: [] })
      });

      await getAllHolidays();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/holidays.json'),
        expect.any(Object)
      );
    });
  });

  describe('checkIfHoliday', () => {
    it('should check if a specific date is a holiday', async () => {
      const mockResponse = {
        status: 'success',
        data: { is_holiday: true, title: 'Año Nuevo' }
      };

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await checkIfHoliday('2024-01-01');

      expect(result.status).toBe('success');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/holidays/is/2024-01-01.json'),
        expect.any(Object)
      );
    });
  });
});
