import React, { Suspense, lazy, useEffect } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { history } from "./history";
import { connect } from "react-redux";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import { ContextLayout } from "./utility/context/Layout";
import { types } from "./configs/permissionTypes";

// Route-based code splitting
const error404 = lazy(() => import("./views/pages/misc/error/404"));
const error500 = lazy(() => import("./views/pages/misc/error/500"));
const Login = lazy(() => import("./views/pages/authentication/login/Login"));
const ForgotPassword = lazy(() =>
  import("./views/pages/authentication/ForgotPassword")
);
const lockScreen = lazy(() =>
  import("./views/pages/authentication/LockScreen")
);
const resetPassword = lazy(() =>
  import("./views/pages/authentication/ResetPassword")
);

const Dashboard = lazy(() => import("./views/dashboard/dashboard"));


const RolesListing = lazy(() => import("./views/roles/roles-listing"));
const RoleEdit = lazy(() => import("./views/roles/role-edit"));

const UsersListing = lazy(() => import("./views/users/users-listing"));
const UserForm = lazy(() => import("./views/users/users-form"));

const Categories = lazy(() =>
  import("./views/attribute-cataloge/categories/categories")
);
const Subcategories = lazy(() =>
  import("./views/attribute-cataloge/subcategories/subcategories")
);

const InsuranceList = lazy(() =>
  import("./views/attribute-cataloge/insurance/list")
);
const InsuranceForm = lazy(() =>
  import("./views/attribute-cataloge/insurance/form")
);

const FinanceList = lazy(() =>
  import("./views/attribute-cataloge/finance/list")
);
const FinanceForm = lazy(() =>
  import("./views/attribute-cataloge/finance/form")
);

const ProductsListing = lazy(() => import("./views/products/products"));
const ProductForm = lazy(() => import("./views/products/product-add"));
const DepartmentList = lazy(() =>
  import("./views/attribute-cataloge/department/list")
);

const Colors = lazy(() =>
  import("./views/attribute-cataloge/general/colors/colors")
);
const Varients = lazy(() =>
  import("./views/attribute-cataloge/general/varients/varients")
);
const PaymentTypes = lazy(() =>
  import("./views/attribute-cataloge/general/payment-types/payment-types")
);

const EnquiryTypes = lazy(() =>
  import("./views/attribute-cataloge/general/enquiry-types/enquiry-types")
);

const LeadTypes = lazy(() =>
  import("./views/attribute-cataloge/general/lead-types/lead-types")
);

const LeadCategories = lazy(() =>
  import("./views/attribute-cataloge/general/lead-categories/lead-categories")
);

const EnquiryList = lazy(() => import("./views/enquiry/list"));
const EnquiryForm = lazy(() => import("./views/enquiry/form"));

const AddSalesLead = lazy(() => import("./views/sales/form"));
const SalesLeadList = lazy(() => import("./views/sales/list"));

const AddServiceHistory = lazy(() => import("./views/service/history-form"));
const ServiceHistory = lazy(() => import("./views/service/history-list"));

const AddServiceSchedule = lazy(() => import("./views/service/schedule-form"));
const ServiceSchedule = lazy(() => import("./views/service/schedule-list"));

const AddPurchase = lazy(() => import("./views/purchases/purchase-add"));
const Purchases = lazy(() => import("./views/purchases/purchases"));



const AccessoriesList = lazy(() =>
  import("./views/attribute-cataloge/accessories/accessories")
);

const SparePartsList = lazy(() => import("./views/attribute-cataloge/spare-parts/spare-parts"));

const ReceiptsList = lazy(() => import("./views/receipts/receipts"));
const ReceiptForm = lazy(() => import("./views/receipts/receipt-form"));
const ReceiptPrint = lazy(() => import("./views/receipts/receipt-print"));

const QuotationsList = lazy(() => import("./views/quotations/quotations"));
const QuotationForm = lazy(() => import("./views/quotations/quotation-form"));
const QuotationPreview = lazy(() => import("./views/quotations/quotation-preview"));
const QuotationPrint = lazy(() => import("./views/quotations/quotation-print"));

// Set Layout and Component Using App Route
const RouteConfig = ({
  component: Component,
  fullLayout,
  auth,
  allowAdmin,
  permission,
  type,
  general,
  requireAuth,
  ...rest
}) => {

  let permissions = [];
  if (auth && auth.user && requireAuth) {
    permissions = auth.user.permissions;
  }

  useEffect(() => {
    if (requireAuth && auth.user && !checkAccess() && !isAdmin()) {
      // if user is logged in and doesn't have access to specific route than route him to dashboard
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (requireAuth && Object.keys(auth).length <= 0) {
      // if user is not logged in and route he has entered require authentication than route him to login
      history.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, rest]);

  const checkAccess = () => {
    const permissionRow = permissions.filter(
      (item) => item.permission_detail.name === permission && item[type]
    );
    return permissionRow.length > 0;
  };

  const isAdmin = () => {
    const {
      user: {
        role: { name, id },
      },
    } = auth;

    return id === 1 && name === "Admin";
  };

  if (!auth.user && requireAuth) {
    return (
      <Route
        to="/login"
        render={(props) => (
          // <ContextLayout.Consumer>
          //   {(context) => {
          //     let LayoutTag =
          //       fullLayout === true
          //         ? context.fullLayout
          //         : context.state.activeLayout === "horizontal"
          //         ? context.horizontalLayout
          //         : context.VerticalLayout;
          //     return (
          //       <LayoutTag {...props}>
          //         <Suspense fallback={<Spinner />}>
          <Login />

          //         </Suspense>
          //       </LayoutTag>
          //     );
          //   }}
          // </ContextLayout.Consumer>
        )}
      />
    );
  }

  const routeComponent = (toDashboard = false) => (
    <Route
      {...rest}
      render={(props) => (
        <ContextLayout.Consumer>
          {(context) => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                  ? context.horizontalLayout
                  : context.VerticalLayout;
            return (
              <LayoutTag {...props}>
                <Suspense fallback={<Spinner />}>
                  {toDashboard ? <Dashboard /> : <Component {...props} />}
                </Suspense>
              </LayoutTag>
            );
          }}
        </ContextLayout.Consumer>
      )}
    />
  );
  // don't check permissions if route is for general purpose or if it doen't require authentication
  if (general || !requireAuth) {
    return routeComponent();
  } else {
    if (allowAdmin && isAdmin()) {
      return routeComponent();
    } else if (permission && type && checkAccess()) {
      return routeComponent();
    } else {
      return routeComponent(true);
    }
  }
};

const mapStateToProps = (state) => {

  return {
    auth: state.auth,
  };
};

export const AppRoute = connect(mapStateToProps)(RouteConfig);

const RedirectIfLoggedin = ({ auth, ...props }) => {
  useEffect(() => {
    if (Object.keys(auth).length > 0) {
      history.goBack();
    }
  }, [auth]);

  return <AppRoute {...props} />;
};

export const RedirectIfLoggedinComp = connect(mapStateToProps)(
  RedirectIfLoggedin
);

class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>

        <Switch>
          <AppRoute
            path="/"
            exact
            requireAuth={true}
            general
            component={Dashboard}
          />

          <AppRoute
            path="/service-history"
            exact
            requireAuth={true}
            general
            component={ServiceHistory}
          />
          <AppRoute
            requireAuth={true}
            permission="service"
            type={types.create}
            allowAdmin
            exact
            path="/service-history/add"
            component={AddServiceHistory}
          />

          <AppRoute
            requireAuth={true}
            permission="service"
            type={types.edit}
            allowAdmin
            exact
            path="/service-history/:id"
            component={AddServiceHistory}
          />


          <AppRoute
            permission="service"
            path="/service-schedule"
            exact
            requireAuth={true}
            general
            component={ServiceSchedule}
          />

          <AppRoute
            requireAuth={true}
            permission="service"
            type={types.create}
            allowAdmin
            exact
            path="/service-schedule/add"
            component={AddServiceSchedule}
          />

          <AppRoute
            requireAuth={true}
            permission="service"
            type={types.edit}
            allowAdmin
            exact
            path="/service-schedule/:id"
            component={AddServiceSchedule}
          />


      <AppRoute
            permission="sales_lead"
            path="/purchases"
            exact
            requireAuth={true}
            general
            component={Purchases}
          />

          <AppRoute
            requireAuth={true}
            permission="sales_lead"
            type={types.create}
            allowAdmin
            exact
            path="/purchases/add"
            component={AddPurchase}
          />

          <AppRoute
            requireAuth={true}
            permission="sales_lead"
            type={types.edit}
            allowAdmin
            exact
            path="/purchases/:id"
            component={AddPurchase}
          />



          {/* Users Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/users"
            component={UsersListing}
          />

          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/users/add"
            component={UserForm}
          />
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/users/:id"
            component={UserForm}
          />

          {/* Roles Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/roles"
            component={RolesListing}
          />
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/roles/:id"
            component={RoleEdit}
          />

          {/* Products Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/products"
            component={ProductsListing}
          />
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/products/add"
            component={ProductForm}
          />
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/products/:id"
            component={ProductForm}
          />

          {/* Categories Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/categories"
            component={Categories}
          />
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/subcategories"
            component={Subcategories}
          />

          {/* Insurance Routes */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/insurance"
            component={InsuranceList}
          />

          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/insurance/add"
            component={InsuranceForm}
          />

          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/insurance/:id"
            component={InsuranceForm}
          />

          {/* Finance Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/finance"
            component={FinanceList}
          />
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/finance/add"
            component={FinanceForm}
          />
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/finance/:id"
            component={FinanceForm}
          />

          {/* Department Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/department"
            component={DepartmentList}
          />
          {/* Color Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/colors"
            component={Colors}
          />
          {/* Varient Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/varients"
            component={Varients}
          />

          {/* Payment Type Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/payment-types"
            component={PaymentTypes}
          />

          {/* Enquiry Type Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/enquiry-types"
            component={EnquiryTypes}
          />

          {/* Lead Type Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/lead-types"
            component={LeadTypes}
          />

          {/* Lead Categories Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/lead-categories"
            component={LeadCategories}
          />

          {/* Enquiry Route  */}
          <AppRoute
            requireAuth={true}
            permission="enquiry"
            type={types.read}
            allowAdmin
            exact
            path="/enquiry"
            component={EnquiryList}
          />
          <AppRoute
            requireAuth={true}
            permission="enquiry"
            type={types.create}
            allowAdmin
            exact
            path="/enquiry/add"
            component={EnquiryForm}
          />
          <AppRoute
            requireAuth={true}
            permission="enquiry"
            type={types.edit}
            allowAdmin
            exact
            path="/enquiry/:id"
            component={EnquiryForm}
          />

          {/* Sales Lead Route  */}
          <AppRoute
            requireAuth={true}
            permission="sales_lead"
            type={types.read}
            allowAdmin
            exact
            path="/sales"
            component={SalesLeadList}
          />
          <AppRoute
            requireAuth={true}
            permission="sales_lead"
            type={types.create}
            allowAdmin
            exact
            path="/sales/add"
            component={AddSalesLead}
          />
          <AppRoute
            requireAuth={true}
            permission="sales_lead"
            type={types.edit}
            allowAdmin
            exact
            path="/sales/:id"
            component={AddSalesLead}
          />

          {/* Receipts Route  */}
          <AppRoute
            requireAuth={true}
            permission="receipt"
            type={types.read}
            allowAdmin
            exact
            path="/receipt"
            component={ReceiptsList}
          />
          <AppRoute
            requireAuth={true}
            permission="receipt"
            type={types.create}
            allowAdmin
            exact
            path="/receipt/add"
            component={ReceiptForm}
          />
          <AppRoute
            requireAuth={true}
            permission="receipt"
            type={types.read}
            allowAdmin
            exact
            fullLayout
            path="/receipt/print/:id"
            component={ReceiptPrint}
          />
          <AppRoute
            requireAuth={true}
            permission="receipt"
            type={types.edit}
            allowAdmin
            exact
            path="/receipt/:id"
            component={ReceiptForm}
          />

      {/* Quotations Route  */}
      <AppRoute
            requireAuth={true}
            permission="quotation"
            type={types.read}
            allowAdmin
            exact
            path="/quotations"
            component={QuotationsList}
          />
          <AppRoute
            requireAuth={true}
            permission="quotation"
            type={types.create}
            allowAdmin
            exact
            path="/quotations/add"
            component={QuotationForm}
          />
          <AppRoute
            requireAuth={true}
            permission="quotation"
            type={types.read}
            allowAdmin
            exact
            fullLayout
            path="/quotations/print/:id"
            component={QuotationPrint}
          />
          <AppRoute
            requireAuth={true}
            permission="quotation"
            type={types.edit}
            allowAdmin
            exact
            path="/quotations/:id"
            component={QuotationForm}
          />
          <AppRoute
            requireAuth={true}
            permission="quotation"
            type={types.edit}
            allowAdmin
            exact
            path="/quotations/preview/:id"
            component={QuotationPreview}
          />
          

          {/* Accessories Route  */}
          <AppRoute
            requireAuth={true}
            permission="accessories"
            type={types.create}
            allowAdmin
            exact
            path="/accessories"
            component={AccessoriesList}
          />

          {/* Spare Parts Route  */}
          <AppRoute
            requireAuth={true}
            allowAdmin
            exact
            path="/spare-parts"
            component={SparePartsList}
          />

          {/* Authentication & Other Route  */}
          <RedirectIfLoggedinComp
            path="/login"
            requireAuth={false}
            component={Login}
            exact
            fullLayout
          />

          <RedirectIfLoggedinComp
            exact
            requireAuth={false}
            path="/forgot-password"
            component={ForgotPassword}
            fullLayout
          />
          <RedirectIfLoggedinComp
            exact
            requireAuth={false}
            path="/lock-screen"
            component={lockScreen}
            fullLayout
          />
          <RedirectIfLoggedinComp
            requireAuth={false}
            path="/reset-password"
            component={resetPassword}
            exact
            fullLayout
          />
          <AppRoute
            path="/404"
            requireAuth={false}
            component={error404}
            fullLayout
          />

          <AppRoute
            path="/500"
            requireAuth={false}
            component={error500}
            fullLayout
          />
          <AppRoute requireAuth={false} component={error404} fullLayout />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
