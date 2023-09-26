// Makes the background of the app a gradient

export const backgroundGradient = () => {
  const gradient = "bg-gradient-to-tr";

  const from1 = "from-purple"
  const from2 = "from-fuchsia"
  const to3 = "to-teal"
  const to4 = "to-blue"

  if (true) {
    //return gradient.concat(` ${from1}-900 ${to3}-500`);
  }

  return gradient.concat(` ${from1}-900 ${to3}-500`);
}

export const Background = () => {
  return (
    <div className={`absolute top-0 left-0 min-h-screen ${backgroundGradient()} w-screen z-0`} />
  )
}