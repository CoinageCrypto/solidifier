import React, { PureComponent } from 'react';
import { cx } from 'emotion';
import { Flattener } from 'solidifier/flattener';
import * as Styles from '../styles';

import Logo from '../images/coinage_logo.svg';

export default class IndexPage extends PureComponent {
	state = {
		hovered: false,
		files: null,
		selectedFile: null,
		log: null,
	};

	constructor() {
		super();
		this.defaultState = this.state;
		this.startParse = this.startParse.bind(this);
		this.startAgain = this.startAgain.bind(this);
		this.log = this.log.bind(this);
	}

	log = message => {
		this.setState({
			log: `${this.state.log || ''}\n${message}`.trim(),
		});
		setTimeout(() => {
			this.textLog.scrollTop = this.textLog.scrollHeight;
		}, 500);
	};

	addFile = (file, path) => {
		const fullPath = path + file.name;
		const files = Object.assign({}, this.state.files, { [fullPath]: file });
		this.setState({ files });
	};

	traverseFileTree = (item, path = '') => {
		if (item.isFile && /\.sol$/i.test(item.name)) {
			// Get file
			item.file(file => {
				this.addFile(file, path);
			});
		} else if (item.isDirectory) {
			// Get folder contents
			const dirReader = item.createReader();
			dirReader.readEntries(entries => {
				for (const entry of entries) {
					this.traverseFileTree(entry, path + item.name + '/');
				}
			});
		}
	};

	onDropZoneHover = e => {
		e.preventDefault();
		this.setState({ hovered: true });
	};

	onDropZoneLeave = e => {
		e.preventDefault();
		this.setState({ hovered: false });
	};

	onDrop = e => {
		e.preventDefault();

		if (e.dataTransfer.items) {
			for (const item of e.dataTransfer.items) {
				if (!item.webkitGetAsEntry) {
					this.setState({ unsupportedBrowser: true });
					return;
				}

				this.traverseFileTree(item.webkitGetAsEntry());
			}
		} else {
			this.setState({ unsupportedBrowser: true });
		}

		this.clearEvent(e);
	};

	clearEvent = e => {
		if (e.dataTransfer.items) {
			e.dataTransfer.items.clear();
		} else {
			e.dataTransfer.clearData();
		}
	};

	startAgain() {
		this.setState(this.defaultState);
	}

	startParse = async function(path) {
		// Create a new one each time so we have clean context
		const result = await new Flattener().flatten(this.state.files, path);

		this.setState({ result, currentPath: path });

		this.textResult.focus();
		this.textResult.select();
		this.textResult.scrollTop = 0;
	};

	render() {
		const { hovered, files, result, log } = this.state;

		return (
			<div>
				<h1 className={Styles.header}>
					<a href="https://coin.age">
						<img src={Logo} alt="Coinage" />
					</a>{' '}
					Solidifier
				</h1>
				<div className={Styles.wrapper}>
					<p className={Styles.introText}>
						Takes solidity code and flattens it into a concatenated version ready for Etherscan's
						verification tool.
					</p>
					<ul className={Styles.introList}>
						<li>Runs 100% in the browser</li>
						<li>
							Use it to verify with <a href="https://etherscan.io">etherscan.io</a>
						</li>
						<li>
							<a href="https://github.com/CoinageCrypto/solidifier">Open source</a>
						</li>
					</ul>

					{files && (
						<div className={Styles.UIWrapper}>
							<div className={Styles.console}>
								<div className={Styles.consoleTop}>
									<div className={Styles.fileList}>
										<ul>
											{Object.keys(files).map(path => (
												<li key={path}>
													<button
														onClick={() => this.startParse(path)}
														className={Styles.fileItem(path === this.state.currentPath)}
													>
														{path}
													</button>
												</li>
											))}
										</ul>
									</div>

									<div className={Styles.output}>
										{!this.state.currentPath ? (
											<p>← Select entry file to compile</p>
										) : (
											<textarea ref={textResult => (this.textResult = textResult)}>
												{result}
											</textarea>
										)}
									</div>
								</div>

								<div className={Styles.consoleBottom}>
									<div className={Styles.bottomDrawer}>
										<p>Log</p>
										<textarea ref={textLog => (this.textLog = textLog)}>{log}</textarea>
									</div>

									<div className={Styles.actionsBar}>
										<button onClick={this.startAgain}>↻ Start Again</button>
									</div>
								</div>
							</div>
							<div className={Styles.options}>
								<h2>Options</h2>
								<label>
									<input type="checkbox" /> Insert file names
								</label>
								<label>
									<input type="checkbox" /> Option 2
								</label>
							</div>
						</div>
					)}

					{!files && (
						<div
							className={cx(Styles.dropZone, { [Styles.dropZoneHovered]: hovered })}
							onDragEnter={this.onDropZoneHover}
							onDragOver={this.onDropZoneHover}
							onDragLeave={this.onDropZoneLeave}
							onDragEnd={this.onDropZoneLeave}
							onDrop={this.onDrop}
						>
							<p>
								{hovered
									? 'Cool, now let go!'
									: 'Drag the folder containing your .sol files here...'}
							</p>
						</div>
					)}
				</div>
			</div>
		);
	}
}
