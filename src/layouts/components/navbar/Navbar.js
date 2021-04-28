import React from "react";
import { Navbar } from "reactstrap";
import { connect } from "react-redux";
import NavbarUser from "./NavbarUser";
import userImg from "../../../assets/img/portrait/small/avatar-s-27.png";
import { NavItem, NavLink } from "reactstrap";
import * as Icon from "react-feather";
import { logoutWithJWT } from './../../../redux/actions/auth/loginActions';

const ThemeNavbar = (props) => {
  return (
    <React.Fragment>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar className="header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow navbar-light floating-nav navbar">
        <div className="navbar-wrapper">
          <div className="navbar-container content">
            <div
              className="navbar-collapse d-flex justify-content-between align-items-center"
              id="navbar-mobile"
            >
              <div className="bookmark-wrapper">
                <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
                  <ul className="navbar-nav d-xl-none">
                    <NavItem className="mobile-menu mr-auto">
                      <NavLink
                        className="nav-menu-main menu-toggle hidden-xs is-active"
                        onClick={props.sidebarVisibility}
                      >
                        <Icon.Menu className="ficon" />
                      </NavLink>
                    </NavItem>
                  </ul>
                </div>
              </div>
              {props.horizontal ? (
                <div className="logo d-flex align-items-center">
                  <div className="brand-logo mr-50"></div>
                  <h2 className="text-primary brand-text mb-0">Vuexy</h2>
                </div>
              ) : null}
              <NavbarUser
                logout={props.logoutWithJWT}
                handleAppOverlay={props.handleAppOverlay}
                changeCurrentLang={props.changeCurrentLang}
                userName={props.user.user.firstname+" "+props.user.user.lastname}
                role={props.user.user.role.name}
                userImg={
                  props.user !== undefined &&
                    props.user.loggedInWith !== "jwt" &&
                    props.user.photoUrl
                    ? props.user.login.values.photoUrl
                    : props.user !== undefined && props.user.picture
                      ? props.user.picture
                      : userImg
                }
                loggedInWith={
                  props.user !== undefined &&
                    props.user.values !== undefined
                    ? props.user.values.loggedInWith
                    : null
                }
              />
            </div>
          </div>
        </div>
      </Navbar>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth,
  };
};

export default connect(mapStateToProps, {
  logoutWithJWT
})(ThemeNavbar);
