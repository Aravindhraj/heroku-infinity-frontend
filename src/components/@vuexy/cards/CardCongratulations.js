import React from "react";
import { Smile } from 'react-feather'
import Avatar from '../@core/components/avatar'
import { Card, CardBody, CardText } from 'reactstrap'
import decorationLeft from '../../../assets/img/elements/decore-left.png'
import decorationRight from '../../../assets/img/elements/decore-right.png'

class CardCongratulations extends React.Component {
  render() {
  return (
    <Card className='card-congratulations'>
      <CardBody className='text-center'>
        <img className='congratulations-img-left' src={decorationLeft} alt='decor-left' />
        <img className='congratulations-img-right' src={decorationRight} alt='decor-right' />
        <Avatar icon={<Smile size={28} />} className='shadow' color='primary' size='xl' />
        <div className='text-center'>
          <h1 className='mb-1 text-white'>{this.props.cardTitle}</h1>
          <CardText className='m-auto w-75'>
           {this.props.cardContent}
          </CardText>
        </div>
      </CardBody>
    </Card>
  )
  }
}

export default CardCongratulations
