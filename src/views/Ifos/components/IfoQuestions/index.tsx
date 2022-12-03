/* eslint-disable react/no-array-index-key */
import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex, Image } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FoldableText from 'components/FoldableSection/FoldableText'
import config from './config'

const DetailsWrapper = styled.div`
  order: 1;
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 2;
    margin-bottom: 0;
    margin-left: 40px;
  }
`

const IfoQuestions = () => {
  const { t } = useTranslation()

  return (
    <Flex alignItems={['center', null, null, 'start']} flexDirection={['column', null, null, 'row']}>
      <DetailsWrapper>
        <Card>
          <CardHeader>
            <Heading scale="lg" color="secondary">
              {t('Details')}
            </Heading>
          </CardHeader>
          <CardBody>
            {config.map(({ title, description }, i, { length }) => {
              return (
                <FoldableText key={i} mb={i + 1 === length ? '' : '24px'} title={title}>
                  {description.map((desc, index) => {
                    return (
                      <Text key={index} color="textSubtle" as="p">
                        {desc}
                      </Text>
                    )
                  })}
                </FoldableText>
              )
            })}
          </CardBody>
        </Card>
      </DetailsWrapper>
    </Flex>
  )
}

export default IfoQuestions
