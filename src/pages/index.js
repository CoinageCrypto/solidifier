import React, { PureComponent } from 'react';
import { cx } from 'emotion';
import { Flattener } from 'solidifier/flattener';
import { dropZone, dropZoneHovered } from 'solidifier/styles';

export default class IndexPage extends PureComponent {
	state = {
		hovered: false,
		files: null,
	};

	fileContents = {};

	constructor() {
		super();
		this.startParse = this.startParse.bind(this);
	}

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

	startParse = async function(path) {
		// Create a new one each time so we have clean context
		const result = await new Flattener().flatten(this.state.files, path);

		this.setState({ result });
	};

	render() {
		const { hovered, files, result } = this.state;

		if (result) {
			return <pre>{result}</pre>;
		}

		return (
			<div>
				{!files && (
					<div
						className={cx(dropZone, { [dropZoneHovered]: hovered })}
						onDragEnter={this.onDropZoneHover}
						onDragOver={this.onDropZoneHover}
						onDragLeave={this.onDropZoneLeave}
						onDragEnd={this.onDropZoneLeave}
						onDrop={this.onDrop}
					>
						<p>
							{hovered ? 'Cool, now let go!' : 'Drag the folder containing your .sol files here...'}
						</p>
					</div>
				)}

				{files && (
					<ul>
						{Object.keys(files).map(path => (
							<li key={path}>
								<span onClick={() => this.startParse(path)}>{path}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		);
	}
}
