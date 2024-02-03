import json

class Track:
  def __init__(self, name, uri, rank):
    self.name = name
    self.uri = uri
    self.rank = rank

class Friend:
  def __init__(self, name, tracks):
    self.name = name
    self.tracks = tracks
    
class Rank:
  def __init__(self, friend_name, rank):
    self.friend_name = friend_name
    self.rank = rank
    
class RankedTrack:
  def __init__(self, name):
    self.ranks = []
    self.score = 0
    self.name = name
    
  def add_rank(self, friend_name, rank):
    rank = Rank(friend_name, rank)
    self.ranks.append(rank)
    
    self.score = self.calculate_score()
    
  def calculate_score(self):
    score = 0
    for rank in self.ranks:
      score += self.convert_rank_to_points(rank.rank)
    return score
  
  # Ranking is calculated from 1 to n, where n is the number of tracks
  # The higher the rank, the lower the score (higher rank means worse track)
  def convert_rank_to_points(self, rank):
    num_tracks = 3
    
    return num_tracks - rank + 1
    
class Ranking:
  def __init__(self):
    self.friends = []
    self.ranked_tracks = []
    
  def add_friend(self, friend):
    for track in friend.tracks:
      self.add_track(friend.name, track)
      
    self.friends.append(friend)
      
  def add_track(self, friend_name, track):
    for ranking in self.ranked_tracks:
      if ranking.name == track.name:
        ranking.add_rank(friend_name, track.rank)
        return
    
    ranked_track = RankedTrack(track.name)
    ranked_track.add_rank(friend_name, track.rank)
    self.ranked_tracks.append(ranked_track)
    
  def print_rankings(self):
    sorted_rankings = sorted(self.ranked_tracks, key=lambda x: x.score, reverse=True)
    
    for track in sorted_rankings:
      print(str(track.score) + ": " + track.name)
      
      

friend1 = Friend("Friend1", [Track("Trippy", "asdyui7yi21", 1), Track("Something Good", "adhbsad7i", 2), Track("Lavender", "98ahds9dbisdk", 3)])
friend2 = Friend("Friend2", [Track("Something Good", "adhbsad7i", 1), Track("Kerosene", "kbklnas14a", 2), Track("Lavender", "98ahds9dbisdk", 3)])
friend3 = Friend("Friend3", [Track("Lavender", "98ahds9dbisdk", 1), Track("Trippy", "asdyui7yi21", 2), Track("Control", "9hausdbn213", 3)])
friend4 = Friend("Friend4", [Track("Lavender", "98ahds9dbisdk", 1), Track("Trippy", "asdyui7yi21", 2), Track("Canopée", "hiiagfsduyv1", 3)])

ranking = Ranking()

for friend in [friend1, friend2, friend3, friend4]:
  ranking.add_friend(friend)
  
ranking.print_rankings()