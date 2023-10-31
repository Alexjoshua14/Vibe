import { beforeAll, describe, expect, it, spyOn } from 'bun:test'

import { sampleItem, sampleItem2, sampleItemBrief, sampleItemBrief2, sampleItemWrapper } from '../../testData/sampleData'
import { mapToSongs, msToTime, playbackTime, progressToPercentage, songDataToSongBrief, tokenExpirationFromNow, tokenExpired } from '../helper'

/* Song Data Brief Parsing */
describe('Test songDataToSongBrief function', () => {
  it('Should properly map fields', () => {
    const parsedSample1 = songDataToSongBrief(sampleItem)
    expect(parsedSample1).toMatchObject(sampleItemBrief)
    expect(songDataToSongBrief(sampleItem2)).toMatchObject(sampleItemBrief2)
  })
})

/* Time Conversion */
describe('Test msToTime', () => {
  it('Should properly format 0', () => {
    expect(msToTime(0)).toBe('00:00')
  })

  it('Should properly parse reasonable times', () => {
    expect(msToTime(1_000)).toBe('00:01')
    expect(msToTime(14_000)).toBe('00:14')
    expect(msToTime(30_000)).toBe('00:30')
    expect(msToTime(60_000)).toBe('01:00')
    expect(msToTime(65_000)).toBe('01:05')
    expect(msToTime(125_000)).toBe('02:05')
    expect(msToTime(609_000)).toBe('10:09')
  })

  it('Should round down', () => {
    expect(msToTime(1001)).toBe('00:01')
    expect(msToTime(1901)).toBe('00:01')
    expect(msToTime(14_000)).toBe('00:14')
    expect(msToTime(14_004)).toBe('00:14')
    expect(msToTime(14_999)).toBe('00:14')
    expect(msToTime(30_003)).toBe('00:30')
    expect(msToTime(30_943)).toBe('00:30')
    expect(msToTime(60_000)).toBe('01:00')
    expect(msToTime(60_209)).toBe('01:00')
    expect(msToTime(60_999)).toBe('01:00')
    expect(msToTime(65_000)).toBe('01:05')
    expect(msToTime(65_030)).toBe('01:05')
    expect(msToTime(65_300)).toBe('01:05')
    expect(msToTime(125_000)).toBe('02:05')
    expect(msToTime(125_999)).toBe('02:05')
    expect(msToTime(609_000)).toBe('10:09')
    expect(msToTime(609_002)).toBe('10:09')
    expect(msToTime(609_998)).toBe('10:09')
  })
})

/* Token Expiration Time Check */
describe('Test tokenExpirationFromNow', () => {
  //Freeze time
  const customTimestamp = Date.now()
  beforeAll(() => {
    spyOn(global.Date, 'now').mockImplementation(() => customTimestamp)
  })

  it('Should return a proper value when given 0 seconds', () => {
    // Give it 10 seconds to expire
    const expLength = 0;
    const expectedTimestamp = Math.floor((customTimestamp / 1000) + expLength)

    expect(tokenExpirationFromNow(expLength)).toBe(expectedTimestamp)
  })

  it('Should return a proper value when given 10 seconds', () => {
    // Give it 10 seconds to expire
    const expLength = 10;
    const expectedTimestamp = Math.floor((customTimestamp / 1000) + expLength)

    expect(tokenExpirationFromNow(expLength)).toBe(expectedTimestamp)
  })

  it('Should return a proper value when given 24 seconds', () => {
    // Give it 10 seconds to expire
    const expLength = 24;
    const expectedTimestamp = Math.floor((customTimestamp / 1000) + expLength)

    expect(tokenExpirationFromNow(expLength)).toBe(expectedTimestamp)
  })

  it('Should return a proper value when given a floating point time', () => {
    // Give it 10 seconds to expire
    const expLength = 24.621;
    const expectedTimestamp = Math.floor((customTimestamp / 1000) + expLength)

    expect(tokenExpirationFromNow(expLength)).toBe(expectedTimestamp)
  })
})

/* Token Expiration Check */
describe('Should return a boolean indicating if token is expired or not', () => {
  //Freeze time
  const customTimestamp = Date.now()
  beforeAll(() => {
    spyOn(global.Date, 'now').mockImplementation(() => customTimestamp)
  })

  it(`Should return false if no value is provided (token doesn't expire`, () => {
    expect(tokenExpired()).toBeFalse()
    expect(tokenExpired(undefined)).toBeFalse()
  })

  it('Should return false if expiration time is after than current time', () => {
    const expirationTime01 = (customTimestamp / 1000) + 1;
    const expirationTime40 = (customTimestamp / 1000) + 40;
    expect(tokenExpired(expirationTime01)).toBeFalse()
    expect(tokenExpired(expirationTime40)).toBeFalse()
  })

  it('Should return true if expiration time is before than current time', () => {
    const expirationTime01 = (customTimestamp / 1000) - 1;
    const expirationTime40 = (customTimestamp / 1000) - 40;
    expect(tokenExpired(expirationTime01)).toBeTrue()
    expect(tokenExpired(expirationTime40)).toBeTrue()
  })

  it('Should return true if expiration time is the current time', () => {
    const expirationTime = (customTimestamp / 1000);
    expect(tokenExpired(expirationTime)).toBeTrue()
  })
})

/* Adjust Progress According to Data Timestamp */
describe('Should get real playback time based off of the progress at the given timestamp', () => {
  //Freeze time
  const customTimestamp = Date.now()
  beforeAll(() => {
    spyOn(global.Date, 'now').mockImplementation(() => customTimestamp)
  })

  it('Should return proper value when timestamp is exactly the same as now', () => {
    const progress = 10_000
    expect(playbackTime(customTimestamp, progress)).toBe(progress)
  })

  it('Should return proper value when timestamp is a few seconds ago', () => {
    const progress = 10_000
    const dataDelay = 4_000
    expect(playbackTime(customTimestamp - dataDelay, progress)).toBe(progress + dataDelay)
  })

  it('Should return proper value when timestamp is a few seconds ago', () => {
    const progress = 10_000
    const dataDelay = 9_000
    expect(playbackTime(customTimestamp - dataDelay, progress)).toBe(progress + dataDelay)
  })

  it('Should return proper value when timestamp is several seconds ago', () => {
    const progress = 14_000
    const dataDelay = 41_000
    expect(playbackTime(customTimestamp - dataDelay, progress)).toBe(progress + dataDelay)
  })

  it('Should return proper value when timestamp is several seconds ago', () => {
    const progress = 10_000
    const dataDelay = 41_000
    expect(playbackTime(customTimestamp - dataDelay, progress)).toBe(progress + dataDelay)
  })

  it('Should return proper value when timestamp is several seconds ago and progress was 0', () => {
    const progress = 0
    const dataDelay = 41_000
    expect(playbackTime(customTimestamp - dataDelay, progress)).toBe(progress + dataDelay)
  })
})


/* Convert Progress in ms and Duration to Percentage */
describe('Test progressToPercentage', () => {
  it('Should return 0 if time is null', () => {
    expect(progressToPercentage(null!, 14_000)).toBe(0)
  })

  it('Should return 0 if duration is null', () => {
    expect(progressToPercentage(1_200, null!)).toBe(0)
  })

  it('Should return 0 if duration is 0', () => {
    expect(progressToPercentage(1_200, 0)).toBe(0)
  })

  it('Should return 0 if duration is less than 0', () => {
    expect(progressToPercentage(1_200, -41_000)).toBe(0)
  })

  it('Should return 0 if time is less than 0', () => {
    expect(progressToPercentage(-1_000, 41_000)).toBe(0)
  })

  it('Should return 0 if time is 0', () => {
    expect(progressToPercentage(0, 41_000)).toBe(0)
  })

  it('Should return percentage properly', () => {
    const time = 4_000
    const duration = 129_000
    const progress = Math.floor((time / duration) * 100)
    
    expect(progressToPercentage(time, duration)).toBe(progress)
  })

  it('Should return percentage properly', () => {
    const time = 91_000
    const duration = 129_000
    const progress = Math.floor((time / duration) * 100)
    
    expect(progressToPercentage(time, duration)).toBe(progress)
  })

  it('Should return percentage properly', () => {
    const time = 128_000
    const duration = 129_000
    const progress = Math.floor((time / duration) * 100)
    
    expect(progressToPercentage(time, duration)).toBe(progress)
  })

  it('Should return percentage properly', () => {
    const time = 4_000
    const duration = 100_000
    const progress = Math.floor((time / duration) * 100)
    
    expect(progressToPercentage(time, duration)).toBe(progress)
  })

  it('Should return percentage properly', () => {
    const time = 4_021
    const duration = 100_000
    const progress = Math.floor((time / duration) * 100)
    
    expect(progressToPercentage(time, duration)).toBe(progress)
  })

  it('Should cap percentage to 100', () => {
    const time = 100_001
    const duration = 100_000
    
    expect(progressToPercentage(time, duration)).toBe(100)
  })

  it('Should cap percentage to 100', () => {
    const time = 109_000
    const duration = 100_000
    
    expect(progressToPercentage(time, duration)).toBe(100)
  })
})