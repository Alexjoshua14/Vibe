
import { computeGroupTopTracks, decodeURI } from "@/lib/topCharts/topTracks"

import { sampleData } from "./sampleData"

const getRankings = async (data: any) => {
  const res = await fetch('http://localhost:3000/api/flask/ranking', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  return res.json()
}

const Track = (name: string, score: number) => {
  return (
    <div className="flex items-center justify-between gap-8">
      <p>
        {name}
      </p>
      <p>
        {score}
      </p>
    </div>
  )
}

export default async function Charts() {

  // const res = await getRankings(sampleData)
  // console.log(res)

  const res = await computeGroupTopTracks()
  console.log(res)

  const tracks = res.map((rt: [string, number]) => {
    return Track(decodeURI(rt[0]), rt[1])
  })

  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-5xl">
          Charts
        </h1>
        <div className="min-w-[400px] w-full min-h-[40vh] flex-1 flex flex-col gap-4 bg-pink-200">
          {
            tracks
          }
        </div>
      </section>
    </main>
  )
}