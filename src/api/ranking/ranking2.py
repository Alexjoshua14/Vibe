
class Track:
  def __init__(self, name, rank):
    self.name = name
    self.rank = rank 
    
class RankedTrack:
  def __init__(self, name):
    self.name = name
    self.score = 0
  
  def add_ranking(self, rank):
    self.score += self.convert_rank_to_points(rank)
    
  def convert_rank_to_points(self, rank):
    num_tracks = 3
    
    return num_tracks - rank
    
class Friend:
  def __init__(self, name, tracks):
    self.name = name
    self.tracks = tracks
    
class Rankings:
  def __init__(self, friends):
    self.friends = friends
    self.ranked_tracks = []
    
    for f in friends:
      self.add_tracks(f.tracks)
      
  def add_tracks(self, tracks):
    for t in tracks:
      self.add_track(t)
      
  def add_track(self, track):
    if not self.track_contained(track):
      self.ranked_tracks.append(RankedTrack(track.name))
    
    # Increment the score for the track in the rankings
    for rt in self.ranked_tracks:
      if rt.name == track.name:
        rt.add_ranking(track.rank)
    
  def track_contained(self, track):
    for t in self.ranked_tracks:
      if t.name == track.name:
          return True
        
    return False
      
  def print_rankings(self):
    sorted_rankings = sorted(self.ranked_tracks, key=lambda x: x.score, reverse=True)
    
    for rt in sorted_rankings:
      print(rt.name + " " + str(rt.score))
    
    
friend1 = Friend("Friend1", [Track("Trippy", 0), Track("Something Good", 1), Track("Lavender", 2)])
friend2 = Friend("Friend2", [Track("Something Good", 0), Track("Kerosene", 1), Track("Lavender", 2)])
friend3 = Friend("Friend3", [Track("Lavender", 0), Track("Trippy", 1), Track("Control", 2)])
friend4 = Friend("Friend4", [Track("Lavender", 0), Track("Trippy", 1), Track("Canopée", 2)])

ranking = Rankings([friend1, friend2, friend3, friend4])

ranking.print_rankings()