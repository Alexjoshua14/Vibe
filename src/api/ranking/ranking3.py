
## Data input format
# {
#   limit: 3,
#   items: {
#     user_id: 1,
#     tracks: {
#     uri: "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
#     rank: 0
#     }[]
#   }[]
# }


# Data output format
# {
#   tracks: {
#     uri: "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
#     score: 6
#   }[] 
# }

data = {
  "limit": 3,
  "items": [
    {
    "user_id":  1,
      "tracks": [
        {
          "uri": "spotify:track:asdnasuiofn3u1oiasd124",
          "rank": 0
        },
        {
          "uri": "spotify:track:ioasnd123sdhn2k13klnzx",
          "rank": 1
        },
        {
          "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
          "rank": 2
        }
      ]
    },
    {
      "user_id": 2,
      "tracks": [
        {
          "uri": "spotify:track:ioasnd123sdhn2k13klnzx",
          "rank": 0
        },
        {
          "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
          "rank": 1
        },
        {
          "uri": "spotify:track:asdnasuiofn3u1oiasd124",
          "rank": 2
        },
      ]
    },
    {
      "user_id": 3,
      "tracks": [
        {
          "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
          "rank": 0
        },
        {
          "uri": "spotify:track:asdnasuiofn3u1oiasd124",
          "rank": 1
        },
        {
          "uri": "spotify:track:ioasnd123sdhn2k13klnzx",
          "rank": 2
        }
      ]
    },
    {
      "user_id": 4,
      "tracks": [
        {
          "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
          "rank": 0
        },
        {
          "uri": "spotify:track:ioasnd123sdhn2k13klnzx",
          "rank": 1
        },
        {
          "uri": "spotify:track:asdnasuiofn3u1oiasd124",
          "rank": 2
        }
      ]
    },
    {
      "user_id": 5,
      "tracks": [
        {
          "uri": "spotify:track:asdnasuiofn3u1oiasd124",
          "rank": 0
        },
        {
          "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
          "rank": 1
        },
        {
          "uri": "spotify:track:09123hnaoisdoi31as321c",
          "rank": 2
        }
      ]
    },
    {
      "user_id": 6,
      "tracks": [
        {
          "uri": "spotify:track:09123hnaoisdoi31as321c",
          "rank": 0
        },
        {
          "uri": "spotify:track:hasd8sadh123bvc132lksi",
          "rank": 1
        },
        {
          "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
          "rank": 2
        }
      ]
    }
  ]
  }

uri_table = {
  "spotify:track:asdnasuiofn3u1oiasd124": "Trippy",
  "spotify:track:ioasnd123sdhn2k13klnzx": "Something Good",
  "spotify:track:4iV5W9uYEdYUVa79Axb7Rh": "Lavender",
  "spotify:track:09123hnaoisdoi31as321c": "Kerosene",
  "spotify:track:hasd8sadh123bvc132lksi": "Solid Gold"
}

def convert_uri_to_name(uri):
  return uri_table[uri]

class Track:
  def __init__(self, uri, rank):
    self.uri = uri
    self.rank = rank
    
class User:
  def __init__(self, id):
    self.id = id
    
class UserData:
  def __init__(self, user, tracks):
    self.user = user
    self.tracks = tracks
  

def create_track(track_data):
  return Track(track_data["uri"], track_data["rank"])


def create_user_data(data):
  user = User(data["user_id"])
  tracks = [create_track(track) for track in data["tracks"]]
  
  return UserData(user, tracks)

def create_user_data_list(data):
  return [create_user_data(d) for d in data]


class Rankings:
  def __init__(self, result_limit):
    # rankings is a hashmap of uri to score
    self.rankings = {}
    self.result_limit = result_limit # Number of tracks to return
  
  def add_user_data(self, user_data):
    for track in user_data.tracks:
      if track.uri in self.rankings:
        self.rankings[track.uri] += self.convert_rank_to_points(track.rank)
      else:
        self.rankings[track.uri] = self.convert_rank_to_points(track.rank)
        
  def convert_rank_to_points(self, rank):
    score = self.result_limit - rank # Ranking is calculated from 1 to n, where n is the number of tracks
    
    return score
  
  def get_rankings(self):
    sorted_rankings = sorted(self.rankings.items(), key=lambda x: x[1], reverse=True)
    
    return sorted_rankings[:self.result_limit]
    
    

def calculate_rankings(data):
  # Parse data
  limit = data["limit"]
  users = create_user_data_list(data["items"])

  
  # Compute the rankings
  rankings = Rankings(limit)

  for u in users:
    rankings.add_user_data(u)


  # Convert the rankings to the output format
  result = rankings.get_rankings()
  
  print(result)
  
  return result

def testing():
  return calculate_rankings(data)
