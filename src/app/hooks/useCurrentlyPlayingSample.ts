export const useCurrentlyPlaying = () => {
  const currentlyPlaying = {
    id: "clomcpxxp000g2j2omgzp8hnr",
    userId: "clomc94yo00032j2oe0t3fqid",
    songId: 22,
    progress_ms: 40000,
    is_playing: false,
    timestamp: "2023-11-06T03:37:23.724Z",
    updatedAt: "2023-11-06T03:43:08.791Z",
    queueId: "clojeb814000gp4axqg3r3nsf",
    suggestedId: "clomchsj900072j2of933e5yq",
    song: {
      id: 22,
      name: "Cosmic Freeway",
      albumId: 22,
      duration_ms: 362666,
      href: "https://api.spotify.com/v1/tracks/3tUJq43sUSw2zasgNjRY7S",
      uri: "spotify:track:3tUJq43sUSw2zasgNjRY7S",
      type: "track",
      explicit: true,
      popularity: 42,
      artists: [
        {
          name: "artist name",
        },
      ],
    },
    queue: {
      id: "clojeb814000gp4axqg3r3nsf",
      updatedAt: "2023-11-04T01:58:37.672Z",
    },
    suggested: {
      id: "clomchsj900072j2of933e5yq",
      updatedAt: "2023-11-06T03:31:03.477Z",
    },
    members: [
      {
        id: "clomc94yo00032j2oe0t3fqid",
        name: "Barb Gram",
        email: null,
        emailVerified: null,
        image: null,
        currentlyPlayingId: "clomcpxxp000g2j2omgzp8hnr",
        queueId: "clojeb814000gp4axqg3r3nsf",
        suggestedId: "clomchsj900072j2of933e5yq",
      },
    ],
  }
  const progress = { time: 362666, percentage: 100 }
  const imageURL =
    "https://i.scdn.co/image/ab67616d0000b2737f0fb0f6082a74998505fe8f"

  return {
    currentlyPlaying,
    progress,
    imageURL,
  }
}
