import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText
} from 'reactstrap'

class CardPriceBreakup extends React.Component {
  render() {

   const vehicle_cost = this.props.recentPurchase.vehicle_cost+" INR";
   const road_tax_cost = this.props.recentPurchase.road_tax_cost+" INR";
   const insurance_cost = this.props.recentPurchase.insurance_cost+" INR";
   const reg_handling_cost = this.props.recentPurchase.reg_handling_cost+" INR";
   const min_accessories_cost = this.props.recentPurchase.min_accessories_cost+" INR";
   const extra_fitting_cost = this.props.recentPurchase.extra_fitting_cost+" INR";
   const total_sales_price = this.props.recentPurchase.total_sales_price+" INR";
   

    const statesArr = [
      {
        title: 'Vehicle Cost',
        value: vehicle_cost
      },
      {
        title: 'Registration',
        value: reg_handling_cost
      },
      {
        title: 'Road Tax',
        value: road_tax_cost
      },
      {
        title: 'Insurance',
        value: insurance_cost
      },
      {
        title: 'Extra Fitting',
        value: extra_fitting_cost
      },
      {
        title: 'Min.Accessories',
        value: min_accessories_cost
      },
      {
        title: 'Total Cost',
        value: total_sales_price
      }

    ]

    const renderStates = () => {
      return statesArr.map(state => {
        return (
          <div key={state.title} className='browser-states'>

            <h6 className='align-self-center mb-0'>{state.title}</h6>

            <div className='d-flex align-items-center'>
              <div className='font-weight-bold text-body-heading mr-1'>{state.value}</div>
            </div>
          </div>
        )
      })
    }

    return (
      <Card className='card-browser-states'>
        <CardHeader>
          <div>
            <CardTitle tag='h4'>Price Breakup</CardTitle>
            <CardText className='font-small-2'>{this.props.productName} </CardText>
          </div>
        </CardHeader>
        <CardBody>{renderStates()}</CardBody>
      </Card>
    )
  }
}

export default CardPriceBreakup
