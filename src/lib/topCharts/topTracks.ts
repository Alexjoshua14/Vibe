import { uri_table, userData } from "./sampleData"

// url for backend API
const baseURL = 
  process.env.NODE_ENV === 
  'development' ? 'http://localhost:3000/'
    : 'https://vibe-zeta.vercel.app/'

// Fetch the top tracks for the current user
// Slightly external to func but this should likely be called
// on a periodic basis once initiated (accepted by user)
// i.e., ensure db has user's most current top tracks each 24hr or (24 * 7) hours
//        or even each time user opens app (I think this is what apps like tinder does)
const fetchTopTracks = async () => {
  // 1) Grab user id / required info from current session

  // 2) Call spotify API endpoint for desired data
  // desired data: top tracks, likely max of 10-20 items

  // 3) Parse response and return some predetermined structure

  return "TODO"
}


// Grab the top track data for each user in a given group
const getGroupTopTrackData = async () => {
  // Fetch top tracks info for each member in the specified group
  // grabbing their top track info from the db where it should be
  // Aggregate the data, making it ready for computations

  return userData
}


// Grab the top track data and send it to flask backend for processing
export const computeGroupTopTracks = async () => {
  const groupData = await getGroupTopTrackData()
  // groupData format should be
  /**
   *  {
   *    user_id: number (or maybe string)
   *    tracks: {
   *      uri: string,
   *      ranking: number
   *    }[]  
   *  }[]
   */

    // Convert group data to proper request data
    const requestData = {
      limit: 3,
      items: groupData
    }

    // Hand data off to backend for analysis
  const res = await fetch(`${baseURL}api/flask/ranking`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  })

  return res.json()
}

// TODO: Connect this to spotify API endpoint and possibly
// throw in some cacheing mechanism 
export const decodeURI = (uri: string) => {
  return uri_table.get(uri) ?? "Unkown"
}