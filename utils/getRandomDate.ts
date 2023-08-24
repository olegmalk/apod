import { END_DATE, START_DATE } from "../constants/date";

export function getRandomDate() {
    const start = START_DATE; // APOD started on 16 June 1995
    const end = END_DATE;
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }