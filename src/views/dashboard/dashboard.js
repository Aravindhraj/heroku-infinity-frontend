import React, { useEffect, useState } from "react";
import { CheckCircle, PhoneCall, Target, Tool, FileText } from "react-feather";
import { Col, Row } from "reactstrap";
import StatisticsCard from "../../components/@vuexy/statisticsCard/StatisticsCard";
import { permissions } from "../../configs/permissionsConfig";
import { getDashboardCounters } from "../../services/dashboard.service";
import { getLead } from "../../services/sales-lead.service";
import { getRecentPurchase } from "../../services/purchases.service";
import CardCongratulations from '../../components/@vuexy/cards/CardCongratulations'
import CardPriceBreakup from '../../components/@vuexy/cards/CardPriceBreakup'
import { store } from "../../redux/storeConfig/store";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [counters, setCounters] = useState({});
  const [sales, setSales] = useState({});
  const [recentPurchase, setRecentPurchase] = useState({});
  const user = store.getState().auth.user;
  const [varientName, setVarientName] = useState({});

  useEffect(() => {
    const getCounters = async () => {
      const res = await getDashboardCounters();
      
      if (res) {
        setCounters(res);
      }
      console.log("res COUNTERS");
      console.log(res);
    };
    getCounters();
    
  }, []);

  useEffect(() => {
    const getSales = async () => {
      const res = await getLead(1);
      if (res) {
        setSales(res);
      }
    };
    getSales();

  }, []);

  useEffect(() => {
    const getRecent = async () => {
      const res = await getRecentPurchase(user._id);
      if (res) {
        if (res[0]) {
          setRecentPurchase(res[0].product_data);
          setVarientName(res[0].product_data.varients.name);
        }
      }
    };
    if (user.role.name === 'Customer') {
      getRecent();
    }
  }, []);
  return (
    <>
      {(user.role.name === 'Customer') ? (
        <div id='dashboard-analytics'>
          {
            recentPurchase.name ? (
              <Row className='match-height'>
                <Col lg='6' sm='12'>
                  <CardCongratulations
                    cardTitle={"Congratulations " + user.firstname}
                    cardContent={"on buying your new bike " + recentPurchase.name + " " + varientName}

                  />
                </Col>
                <Col>
                  <CardPriceBreakup
                    recentPurchase={recentPurchase}
                    productName={recentPurchase.name + " " + varientName}
                  />
                </Col>
              </Row>
            ) : (<Col lg='6' sm='12'>
              <CardCongratulations
                cardTitle={"Welcome " + user.firstname}
              />
            </Col>)
          }
        </div>) : ("")}
      <Row className="match-height">
        {counters[permissions.enquiry] ? (
          <Col lg="3" sm="6">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="primary"
              icon={<Link to="/enquiry"><PhoneCall className="primary" size={22} /></Link>}
              stat={counters[permissions.enquiry]}
              statTitle="Enquiries"
            />
          </Col>
        ) : (
            ""
          )}

        {counters[permissions.sales_lead] ? (
          <>
          <Col lg="3" sm="6">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="warning"
              icon={<Link to="/sales"><Target className="warning" size={22} /></Link>}
              stat={counters[permissions.sales_lead]}
              statTitle="Sales Leads"
            />
          </Col>
          <Col lg="3" sm="6">
          <StatisticsCard
            hideChart
            iconRight
            iconBg="success"
            icon={<Link to="/purchases"><CheckCircle className="success" size={22} /></Link>}
            stat={counters[permissions.purchases]}
            statTitle="Purchases"
          />
        </Col>
        <Col lg="3" sm="6">
          <StatisticsCard
            hideChart
            iconRight
            iconBg="success"
            icon={<Link to="/quotations"><FileText className="success" size={22} /></Link>}
            stat={counters[permissions.quotations]}
            statTitle="Quotations"
          />
        </Col>
        
        </>
        ) : (
            ""
          )}

        {counters["service_history"] ? (
          <Col lg="3" sm="6">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="info"
              icon={ <Link to="/service-history"><Tool className="info" size={22} /></Link>}
              stat={counters["service_history"]}
              statTitle="Services Done"
            />
          </Col>
        ) : (
            ""
          )}
        {counters["service_schedule"] ? (
          <Col lg="3" sm="6">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="danger"
              icon={<Link to="/service-schedule"><Tool className="danger" size={22} /></Link>}
              stat={counters["service_schedule"]}
              statTitle="Services Scheduled"
            />
          </Col>
        ) : (
            ""
          )}
      </Row>
    </>


  );
};
export default Dashboard;
