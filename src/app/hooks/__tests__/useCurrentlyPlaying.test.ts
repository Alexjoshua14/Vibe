import { renderHook, RenderHookResult } from "@testing-library/react"
import { beforeAll, describe, expect, it, SpyInstance, vi } from "vitest"

import { currentlyPlaying } from "@/testData/currentlyPlayingData"
import * as spotifyAPI from "@/utilities/spotifyAPI"

import { useCurrentlyPlaying } from "../useCurrentlyPlaying"

describe("Testing useCurrentlyPlaying", () => {
  let renderedHook: RenderHookResult<
    ReturnType<typeof useCurrentlyPlaying>,
    ReturnType<typeof useCurrentlyPlaying>
  >
  let mockedGetCurrentlyPlaying: SpyInstance
  let dateSpy: SpyInstance
  let setIntervalSpy: SpyInstance

  beforeAll(() => {
    mockedGetCurrentlyPlaying = vi
      .spyOn(spotifyAPI, "getClientCurrentlyPlaying")
      .mockImplementation(async () => Promise.resolve(currentlyPlaying))

    vi.useFakeTimers()
    setIntervalSpy = vi.spyOn(global, "setInterval")
    dateSpy = vi
      .spyOn(global.Date, "now")
      .mockReturnValue(currentlyPlaying.timestamp + 10000)

    renderedHook = renderHook(() => useCurrentlyPlaying())
  })

  it("Ensure that getClientCurrentlyPlaying is being mocked", async () => {
    setTimeout(() => {}, 1000)
    expect(mockedGetCurrentlyPlaying).toHaveBeenCalled()
  })

  it("Check that currentlyPlaying song is updated on fetch", () => {
    expect(renderedHook.result.current.currentlyPlaying).toEqual(
      currentlyPlaying,
    )
  })

  it("Check that fetchData occurs again after 15 seconds", () => {
    setTimeout(() => {
      expect(mockedGetCurrentlyPlaying).toHaveBeenCalledTimes(2)
    }, 15000)
  }, 20)

  it("Ensure that data fetching has been scheduled to run repeatedly", () => {
    expect(setIntervalSpy).toHaveBeenCalled()
    // Identify functions by timer length
    expect(setIntervalSpy).toHaveBeenNthCalledWith(
      1,
      expect.any(Function),
      10000,
    )
  })

  it("Check that progress is being updated", () => {
    vi.advanceTimersByTime(20000)
    expect(dateSpy).toHaveBeenCalledTimes(20)
  })
})
