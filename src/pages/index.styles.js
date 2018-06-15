import { css, cx } from 'emotion';

import '../styles/global.css';

const bp = {
	desktop: '@media (max-width: 991px)',
	tablet: '@media (max-width: 767px)',
	mobile: '@media (max-width: 479px)',
};

export const dropZone = css({
	border: '1px solid #333',
	width: '100%',
	height: '200px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	boxShadow: '0 0 0 1px #fff inset',
	'& p': {
		margin: 0,
	},
});

export const dropZoneHovered = css({
	background: '#ccc',
});

export const introList = css({
	'& li': {
		color: '#333',
		'& a': {
			color: 'inherit',
		},
	},
});

export const UIWrapper = css({
	display: 'flex',
	flexDirection: 'row',
});

export const console = css({
	border: '1px solid #333',
	marginRight: '20px',
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
});

export const consoleTop = css({
	display: 'flex',
});

export const fileItem = selected =>
	css({
		display: 'block',
		border: 'none',
		padding: '10px 10px 10px 30px',
		textAlign: 'right',
		textDecoration: 'underline',
		cursor: 'pointer',
		background: 'transparent',
		width: '100%',

		...(selected
			? {
					background: '#333',
					color: '#fff',
			  }
			: {
					'&:hover': {
						backgroundColor: '#ccc',
					},
			  }),
	});

export const options = css({
	border: '1px solid #333',
	width: '300px',

	'& h2': {
		margin: 0,
		background: '#333',
		color: '#fff',
		fontWeight: 300,
		fontSize: '14px',
		padding: '10px',
		marginBottom: '10px',
	},
	'& label': {
		display: 'block',
		padding: '10px',
	},
});

export const wrapper = css({
	padding: '20px',
	maxWidth: '1400px',
});

export const header = css({
	color: '#fff',
	background: '#000',
	fontWeight: 'normal',
	textShadow: '0 2px 0 #b27200',
	display: 'flex',
	alignItems: 'center',
	textTransform: 'uppercase',
	letterSpacing: '1.5px',
	lineHeight: 1,
	fontWeight: 300,
	margin: 0,
	padding: '20px',
	cursor: 'default',
	'& img': {
		verticalAlign: 'middle',
		marginRight: '20px',
	},
});

export const fileList = css({
	borderRight: '1px solid #333',
	flexShrink: 1,
	'& ul': {
		margin: 0,
		padding: 0,
		listStyle: 'none',
		'& li': {
			padding: 0,
		},
	},
});

export const output = css({
	flexGrow: 1,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	boxShadow: '0 0 0 1px #fff inset',
	'& p': {
		margin: 0,
	},
	'& textarea': {
		border: 'none',
		padding: '20px',
		whiteSpace: 'pre',
		width: '100%',
		height: '100%',
		background: '#fff',
	},
});

export const introText = css({
	margin: 0,
	fontSize: '16px',
});

export const consoleBottom = css({
	borderTop: '1px solid #333',
	display: 'flex',
	flexDirection: 'column',
});

export const bottomDrawer = css({
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
	margin: '10px',
	'& p': {
		margin: '0 0 5px 0',
	},
	'& textarea': {
		border: '1px solid #333',
		padding: '10px',
		whiteSpace: 'pre',
		width: '100%',
		height: '100px',
		background: '#fff',
		outline: 'none',
	},
});

export const actionsBar = css({
	display: 'flex',
	padding: '10px',
	justifyContent: 'flex-end',
	'& button': {
		border: '1px solid #333',
		background: '#ccc',
		padding: '5px 15px',
		'&:first-child': {
			marginRight: '10px',
		},
	},
});

// This comment is here with the words 'export default' to suppress gatsby's warning about invalid pages.
