// Makes the background of the app a gradient

export const backgroundGradient = () => {
  const gradient = "bg-gradient-to-tr"

  const from1 = "from-purple"
  const from2 = "from-fuchsia"
  const to3 = "to-teal"
  const to4 = "to-blue"

  if (true) {
    //return gradient.concat(` ${from1}-900 ${to3}-500`);
  }

  return gradient.concat(` ${from1}-900 ${to3}-500`)
}

export const Background = () => {
  return (
    <div
      className={`-z-20 h-full w-full overflow-clip absolute top-0 left-0 min-h-screen blur-3xl`}
    >
      <div className="absolute top-40 left-24 h-40 w-96 bg-teal-400 blur" />
      <div className="absolute bottom-40 -right-32 h-[4000px] w-[700px] rotate-6 rounded-full bg-teal-100 blur" />
      <div className="absolute bottom-2 right-0 h-[900px] w-[3000px] -rotate-45 rounded-full bg-teal-700 blur" />
      <div className="absolute -bottom-12 left-48 h-[1400px] w-[300px] -rotate-12 rounded-full bg-teal-300 blur" />
      <div className="absolute bottom-40 right-14 h-[400px] w-[3000px] rounded-full bg-teal-900 blur" />
      <div className="absolute -bottom-12 left-48 h-[1400px] w-[300px] rotate-3 rounded-full bg-teal-200 blur" />
      <div className="absolute bottom-20 right-48 h-[1900px] w-[500px] rotate-45 rounded-full bg-teal-400 blur" />
      <div className="absolute bottom-0 right-0 h-[900px] w-[300px] rounded-full bg-teal-300 blur" />
    </div>
  )
}
