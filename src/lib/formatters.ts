export function eventDescription(duration: number): string {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  const minInString = `${minutes} ${minutes > 1 ? "mins" : "min"}`;
  const hourInString = `${hours} ${hours > 1 ? "hrs" : "hr"}`;

  if (hours === 0 && minutes === 0) {
    return "0min";
  }

  if (hours === 0) {
    return minInString;
  }
  if (minutes === 0) {
    return hourInString;
  }

  return `${hourInString} ${minInString}`;
}
