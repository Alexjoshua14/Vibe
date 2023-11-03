'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'

interface musicLoaderProps { }

const MusicLoader: FC<musicLoaderProps> = ({ }) => {
  return (
    <div className="flex items-center justify-center text-center gap-7 w-full">
      <motion.div
        initial={{ height: 10 }}
        animate={{ height: 90 }}
        transition={{ duration: .75, ease: 'circOut', repeat: Infinity, repeatType: 'reverse', bounce: .2 }}
        className="bg-gradient-to-tr from-pink-900 to-pink-500 w-14 rounded-full"
      />
      <motion.div
        initial={{ height: 310 }}
        animate={{ height: 140 }}
        transition={{ duration: .75, ease: 'circOut', repeat: Infinity, repeatType: 'reverse', bounce: .2 }}
        className="bg-gradient-to-tr from-pink-900 to-pink-500 w-14 rounded-full"
      />
      <motion.div
        initial={{ height: 145 }}
        animate={{ height: 270 }}
        transition={{ duration: .75, ease: 'circOut', repeat: Infinity, repeatType: 'reverse', bounce: .2 }}
        className="bg-gradient-to-tr from-pink-900 to-pink-500 w-14 rounded-full"
      />
      <motion.div
        initial={{ height: 210 }}
        animate={{ height: 100 }}
        transition={{ duration: .75, ease: 'circOut', repeat: Infinity, repeatType: 'reverse', bounce: .2 }}
        className="bg-gradient-to-tr from-pink-900 to-pink-500 w-14 rounded-full"
      />
      <motion.div
        initial={{ height: 80 }}
        animate={{ height: 210 }}
        transition={{ duration: .75, ease: 'circOut', repeat: Infinity, repeatType: 'reverse', bounce: .2 }}
        className="bg-gradient-to-tr from-pink-900 to-pink-500 w-14 rounded-full"
      />
    </div>
  )
}

export default MusicLoader