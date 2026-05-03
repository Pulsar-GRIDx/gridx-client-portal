import { format, addDays } from 'date-fns';

/**
 * @module Global_Components
 */

/**
 * Function to generate a dataset with dates for each day of the year 2023.
 * @returns {Array<Object>} An array of objects, each containing date information for each day of the year 2023.
 * @property {number} index - The index of the date in the dataset.
 * @property {string} dayOfMonth - The day of the month, formatted as 'dd'.
 * @property {string} month - The month, formatted as 'MM'.
 * @property {string} year - The year, formatted as 'yyyy'.
 * @property {string} formattedDate - The full date, formatted as 'dd MMMM yyyy'.
 */
const generateDateDataset = () => {
  const startDate = new Date(2023, 0, 1); // January 1, 2023
  const endDate = new Date(2023, 11, 31); // December 31, 2023

  const dataset = [];

  let currentDate = startDate;

  while (currentDate <= endDate) {
    dataset.push({
      index: dataset.length + 1,
      dayOfMonth: format(currentDate, 'dd'),
      month: format(currentDate, 'MM'),
      year: format(currentDate, 'yyyy'),
      formattedDate: format(currentDate, 'dd MMMM yyyy'),
    });

    currentDate = addDays(currentDate, 1);
  }

  return dataset;
};

export { generateDateDataset };
