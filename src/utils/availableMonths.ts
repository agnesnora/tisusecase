import { ReadingType, months } from "@/schemas/readings";
import { orderReadingsDesc } from "@/utils/dateOrderHelper";

export interface AvailableDate {
  month: (typeof months)[number];
  year: number;
  label: string;
}

export const getAvailableDates = (readings: ReadingType[]): AvailableDate[] => {
  const now = new Date();
  //Looking up latest reading
  const latestReading = [...readings].sort(orderReadingsDesc)[0];

  //setting up next possible date
  let nextPossibleDate: Date;

  if (!latestReading) {
    nextPossibleDate = new Date(now.getFullYear(), 0);
  } else {
    nextPossibleDate = new Date(
      latestReading.year,
      months.indexOf(latestReading.month) + 1
    );
  }

  //Setting up a deadline which limits the months that can be added
  const dateLimit = new Date(now.getFullYear(), now.getMonth() + 1);

  const availableOptions: AvailableDate[] = [];

  //Generating possible dates until reaching the limit date.
  while (nextPossibleDate < dateLimit) {
    const year = nextPossibleDate.getFullYear();
    const monthIndex = nextPossibleDate.getMonth();

    availableOptions.push({
      year,
      month: months[monthIndex],
      label: ` ${months[monthIndex]}-${year} `,
    });

    nextPossibleDate.setMonth(nextPossibleDate.getMonth() + 1);
  }

  return availableOptions;
};
