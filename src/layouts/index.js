import PropTypes from 'prop-types';
import 'solidifier/styles/global.css';

const Layout = ({ children }) => children();

Layout.propTypes = {
	children: PropTypes.func.isRequired,
};

export default Layout;
