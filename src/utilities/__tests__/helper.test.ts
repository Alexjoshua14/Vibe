
import { expect, test, describe, it } from 'vitest'
import { playbackTime, progressToPercentage } from '../helper'

describe("Testing playbackTime", () => {
  test("Filler", () => {
    expect(1).toBe(1);
  })
})

describe("Testing progressToPercentage", () => {
  test("Should convert 5000ms out of 90000ms to 5%", () => {
    const time = 5000; // ms - 5 seconds
    const duration = 90000; // ms - 90 seconds
    const expectedProgress = 5; // percentage - 5%

    expect(progressToPercentage(time, duration)).toBe(expectedProgress)
  })

  test("Should properly return progress at numerous points", () => {
    const time = 900; // ms - 1% of duration
    const duration = 90000; // ms - 90 seconds

    const time0 = 0;
    const expected0 = 0;
    const time1 = time;
    const expected1 = 1;
    const time10 = time * 10;
    const expected10 = 10;
    const time20 = time * 20;
    const expected20 = 20;
    const time50 = time * 50;
    const expected50 = 50;
    const time75 = time * 75;
    const expected75 = 75;
    const time100 = time * 100;
    const expected100 = 100;
    const time110 = time * 110;
    const expected110 = 100;

    expect(progressToPercentage(time0, duration)).toBe(expected0);
    expect(progressToPercentage(time1, duration)).toBe(expected1);
    expect(progressToPercentage(time10, duration)).toBe(expected10);
    expect(progressToPercentage(time20, duration)).toBe(expected20);
    expect(progressToPercentage(time50, duration)).toBe(expected50);
    expect(progressToPercentage(time75, duration)).toBe(expected75);
    expect(progressToPercentage(time100, duration)).toBe(expected100);
    expect(progressToPercentage(time110, duration)).toBe(expected110);

  })

  test("Should convert 45000ms out of 90000ms to 50%", () => {
    const time = 45000; // ms - 45 seconds
    const duration = 90000; // ms - 90 seconds
    const expected = 50; // percentage - 50%

    expect(progressToPercentage(time, duration)).toBe(expected);
  })

  test("Should convert 0ms out of 90000ms to 0%", () => {
    const time = 0; // ms - 0 seconds
    const duration = 90000; // ms - 90 seconds
    const expected = 0; // percentage - 0%

    expect(progressToPercentage(time, duration)).toBe(expected);
  })

  test("Should return 0 if duration is 0 and avoid division by 0 error", () => {
    const time = 40000; // ms - 40 seconds
    const duration = 0; // ms - 0 seconds
    const expected = 0; // percentage - 0%

    expect(progressToPercentage(time, duration)).toBe(expected);
  })

  test("Should gracefully handle null times, returning 0", () => {
    const time = null; // ms - null
    const duration = 0; // ms - 0 seconds
    const duration2 = 50000; // ms - 50 seconds
    const expected = 0; // percentage - 0%

    expect(progressToPercentage(time!, duration)).toBe(expected);
    expect(progressToPercentage(time!, duration2)).toBe(expected);
  })

  test("Should gracefully handle null durations, returning 0", () => {
    const time = 5000; // ms - 5 seconds
    const duration = null; // ms - null
    const expected = 0; // percentage - 0%

    expect(progressToPercentage(time, duration!)).toBe(expected);
  })

  test("Should cap progress to 100", () => {
    const time = 950000; // ms - 5 seconds
    const duration = 90000; // ms - 90 seconds
    const duration1 = -50000; // ms - -50 seconds
    const expected = 100; // percentage - 0%

    expect(progressToPercentage(time, duration)).toBe(expected);
    expect(progressToPercentage(time, duration1)).toBe(expected);
  })

  test("Should never return less than 0", () => {
    const time = -5000; // ms - -5 seconds
    const duration = 50000; // ms - 50 seconds
    const expected = 0;

    expect(progressToPercentage(time, duration)).toBe(expected);
    expect(progressToPercentage(time, duration)).toBe(expected);
  })
  
})