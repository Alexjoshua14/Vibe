
import { describe, test, expect, vi, Mock, assertType } from "vitest";
import { getTopTracks } from "@/utilities/spotifyAPI";
import { topTracksURL } from '@/constants/spotify';
import { topTracks } from '@/data/fetchExamples'
import { SpotifyTopTracksResponse } from "@/lib/validators/spotify";


describe("Testing getTopTracks", async () => {

  const token = "123"

  test("Should correctly parse request", async () => {
     global.fetch = vi.fn(() =>
        Promise.resolve({
          status: 200,
          ok: true,
          json: () => topTracks,
        })
      ) as Mock;

    const response = await getTopTracks(token);

    expect(fetch).toHaveBeenCalledWith(
      topTracksURL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    assertType<SpotifyTopTracksResponse>(response);
  })

  test("Should fail gracefully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 400,
        ok: false,
        statusText: "Deliberate testing error",
      })
    ) as Mock;

    expect(async () => await getTopTracks(token)).rejects.toThrowError();

    expect(fetch).toHaveBeenCalledWith(
      topTracksURL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

  })

  test.todo("Test function call with live fetch")
})


