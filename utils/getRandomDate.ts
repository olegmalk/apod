export function getRandomDate() {
    const start = new Date(1995, 6, 16); // APOD started on 16 June 1995
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }