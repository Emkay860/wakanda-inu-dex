import { ifosConfig } from 'config/constants'
import Container from 'components/Layout/Container'
import { Ifo } from 'config/constants/types'
import IfoCardV3Data from './components/IfoCardV3Data'
import IfoLayout from './components/IfoLayout'

const inactiveIfo: Ifo[] = ifosConfig.filter((ifo) => !ifo.isActive)

const PastIfo = () => {
  return (
    <Container>
      <IfoLayout maxWidth="736px" m="auto" width="100%" id="past-ifos" py={['24px', '24px', '40px']}>
        {inactiveIfo.map((ifo) => {
          console.log('ifo:', ifo)
          return <IfoCardV3Data key={ifo.id} ifo={ifo} />
        })}
      </IfoLayout>
    </Container>
  )
}

export default PastIfo
