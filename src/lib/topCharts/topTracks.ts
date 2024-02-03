import { uri_table, userData } from "./sampleData"


// Fetch the top tracks for the current user
const fetchTopTracks = async () => {
  return "TODO"
}


// Grab the top track data for each user in a given group
const getGroupTopTrackData = async () => {
  // TODO

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


  const res = await fetch('http://localhost:3000/api/flask/ranking', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  })

  return res.json()
}

export const decodeURI = (uri: string) => {
  return uri_table.get(uri) ?? "Unkown"
}