
import { describe, it, beforeAll, expect, vi, SpyInstance} from "vitest"
import * as spotifyAPI from "@/utilities/spotifyAPI"
import { currentlyPlaying } from "@/testData/currentlyPlayingData";
import { RenderHookResult, renderHook } from "@testing-library/react";
import { useCurrentlyPlaying } from "../useCurrentlyPlaying";

describe('Testing useCurrentlyPlaying', () => {
  let renderedHook: RenderHookResult<ReturnType<typeof useCurrentlyPlaying>, ReturnType<typeof useCurrentlyPlaying>>;
  let mocked: SpyInstance

  beforeAll(() => {
    mocked = vi.spyOn(spotifyAPI, 'getClientCurrentlyPlaying')
      .mockImplementation(async () => 
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(currentlyPlaying)
          }, 1000)
        })
      )
    
    renderedHook = renderHook(() => useCurrentlyPlaying())
  })

  it('Ensure that getClientCurrentlyPlaying is being mocked', async () => {
    setTimeout(() => {}, 2000)
    expect(mocked).toHaveBeenCalled()
  })

  it.todo('Check that currentlyPlaying song is updated on fetch', () => {
    expect(renderedHook.result.current.currentlyPlaying).toBeTruthy()
  })

  it.todo('Check that fetchData occurs again after 15 seconds')
})
