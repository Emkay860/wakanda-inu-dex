import { Ifo } from 'config/constants/types'
import IfoFoldableCard from './IfoFoldableCard'

interface Props {
  ifo: Ifo
}

const IfoCardV3Data: React.FC<Props> = ({ ifo }) => {
  return <IfoFoldableCard ifo={ifo} />
}

export default IfoCardV3Data
