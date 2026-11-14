export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target moment has been reached or passed. */
  done: boolean;
}

/** Splits the time until `target` into days, hours, minutes and seconds. */
export function countdown(target: Date, now: Date = new Date()): Countdown {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    done: false,
  };
}
