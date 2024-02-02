

async function sample(data: any) {

  const res = await fetch('http://localhost:3000/api/flask/sample', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  return res.json()
}

async function helloWorld() {
  const res = await fetch('http://localhost:3000/api/flask/hello')
  return res.json()
}

export default async function Charts() {
  const hey = await helloWorld()
  console.log(`Hello world response: ${hey}`)

  const jsonSample = {
    test: "hello there"
  }

  const data = await sample(jsonSample)
  console.log(data)

  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-5xl">
          Charts
        </h1>
        <div className="min-w-[400px] w-full min-h-[40vh] flex-1 bg-pink-200">
          {/* {data} */}
        </div>
      </section>
    </main>
  )
}