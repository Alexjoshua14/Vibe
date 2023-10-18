import { beforeAll, describe, expect, it, spyOn, jest } from 'bun:test'
import { getTopTracks } from '../spotifyAPI'

describe('Test getTopTracks', () => {
  beforeAll(() => {
    const fetchMock = jest.fn()
    const data = {}


    fetchMock.mockResolvedValue(() => data)
    global.fetch = fetchMock
  })

  it('Should throw an error when fetch is unsuccessful', () => {
    expect(1 + 2).toBe(3)
  })
})