import React from "react";
import { NavItem, NavLink } from "reactstrap";
import * as Icon from "react-feather";
import { connect } from "react-redux";
import {
  loadSuggestions,
  updateStarred,
} from "../../../redux/actions/navbar/Index";

class NavbarBookmarks extends React.PureComponent {
  render() {
    let { sidebarVisibility } = this.props;

    return (
      <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
        <ul className="navbar-nav d-xl-none">
          <NavItem className="mobile-menu mr-auto">
            <NavLink
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={sidebarVisibility}
            >
              <Icon.Menu className="ficon" />
            </NavLink>
          </NavItem>
        </ul>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    bookmarks: state.navbar,
  };
};

export default connect(mapStateToProps, { loadSuggestions, updateStarred })(
  NavbarBookmarks
);
