import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AuthContext from '../context/AuthContext';
import DataProvider, { useData } from '../scenes/Main/Data/getData';

const mockFetch = jest.fn();

global.fetch = mockFetch;

const TestComponent = () => {
  const data = useData();

  return (
    <div>
      <div data-testid="unitsData">{data.unitsData}</div>
      <div data-testid="averageUnitsData">{data.averageUnitsData}</div>
      <div data-testid="userData">{JSON.stringify(data.userData)}</div>
      <div data-testid="currentDayEnergy">{data.currentDayEnergy}</div>
    </div>
  );
};

describe('DataProvider', () => {
  const mockUser = { user: 'mockUserToken' };

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem('Token', 'mockUserToken');
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('fetches and provides data', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ units: '10', units_used_today: '5', voltage: '230', current: '5', frequency: '50', active_energy: '100', signal_strength: 'good' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sums: [1, 2, 3], averageUsage: '20' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ UserID: '1', FirstName: 'John', LastName: 'Doe', DRN: '123', Email: 'john.doe@example.com', streetName: '123 Street', cityName: 'City', countryName: 'Country' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => '50',
      });

    render(
      <AuthContext.Provider value={mockUser}>
        <DataProvider>
          <TestComponent />
        </DataProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('unitsData')).toHaveTextContent('10');
    expect(screen.getByTestId('averageUnitsData')).toHaveTextContent('5');
    expect(screen.getByTestId('userData')).toHaveTextContent('John');
    expect(screen.getByTestId('currentDayEnergy')).toHaveTextContent('50');
  });

  it('handles fetch error', async () => {
    mockFetch.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <AuthContext.Provider value={mockUser}>
        <DataProvider>
          <TestComponent />
        </DataProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('unitsData')).toHaveTextContent('');
    expect(screen.getByTestId('averageUnitsData')).toHaveTextContent('');
    expect(screen.getByTestId('userData')).toHaveTextContent('{}');
    expect(screen.getByTestId('currentDayEnergy')).toHaveTextContent('');
  });
});
