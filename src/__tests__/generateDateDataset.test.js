import { generateDateDataset } from '../scenes/Main/Data/DateFNS';
import { addDays, format } from 'date-fns';

describe('generateDateDataset', () => {
  it('should generate a dataset with 365 entries for the year 2023', () => {
    const dataset = generateDateDataset();
    expect(dataset).toHaveLength(365);
  });

  it('should have the correct first entry', () => {
    const dataset = generateDateDataset();
    const firstEntry = dataset[0];

    expect(firstEntry).toEqual({
      index: 1,
      dayOfMonth: '01',
      month: '01',
      year: '2023',
      formattedDate: '01 January 2023',
    });
  });

  it('should have the correct last entry', () => {
    const dataset = generateDateDataset();
    const lastEntry = dataset[364]; // Index 364 for the last day of the year

    expect(lastEntry).toEqual({
      index: 365,
      dayOfMonth: '31',
      month: '12',
      year: '2023',
      formattedDate: '31 December 2023',
    });
  });

  it('should have all entries with valid date information', () => {
    const dataset = generateDateDataset();

    dataset.forEach((entry, index) => {
      const currentDate = new Date(2023, 0, 1);
      const expectedDate = addDays(currentDate, index);
      const expectedFormattedDate = format(expectedDate, 'dd MMMM yyyy');

      expect(entry.index).toBe(index + 1);
      expect(entry.dayOfMonth).toBe(format(expectedDate, 'dd'));
      expect(entry.month).toBe(format(expectedDate, 'MM'));
      expect(entry.year).toBe('2023');
      expect(entry.formattedDate).toBe(expectedFormattedDate);
    });
  });
});
