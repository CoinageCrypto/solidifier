import PropTypes from 'prop-types';
import 'website/styles/global.css';

const Layout = ({ children }) => children();

Layout.propTypes = {
	children: PropTypes.func.isRequired,
};

export default Layout;
