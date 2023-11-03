
import { FC } from 'react'

import MusicLoader from '@/components/loading/musicLoader'

interface loadingProps {

}

const loading: FC<loadingProps> = ({ }) => {
  return (
    <MusicLoader />
  )
}

export default loading