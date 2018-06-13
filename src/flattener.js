import parser from './lib/solidity-parser-antlr';

export class Flattener {
	cachedFileContents = {};

	getImportsInFile = contents => {
		const ast = parser.parse(contents, { tolerant: true, loc: true });
		const imports = [];

		// Search for import directives
		parser.visit(ast, {
			ImportDirective: node => imports.push(node),
		});

		return imports;
	};

	getFileContents = async (path, fileObject) => {
		// If we've already done it, no worries, give them the contents.
		const cached = this.cachedFileContents[path];
		if (cached) return cached;

		// Ok, we need to read it now.
		const contents = await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(reader.error);

			reader.readAsText(fileObject);
		});

		// Update our state object with the text
		this.cachedFileContents[path] = contents;

		return contents;
	};

	// Loc is "location" as defined by solidity-parser-antlr.
	removeByLoc = (contents, loc) => {
		const lines = contents.split(/\r?\n/);
		const startLine = loc.start.line - 1;
		const endLine = loc.end.line - 1;

		if (startLine === endLine) {
			const line = lines[startLine];

			const left = line.substring(0, loc.start.column);
			const right = line.substring(loc.end.column + 1);

			lines[startLine] = left + right;
		} else {
			lines[startLine] = lines[startLine].substring(0, loc.start.column);
			lines[endLine] = lines[endLine].substring(loc.end.column);

			for (let i = startLine + 1; i < endLine; i++) {
				lines[i] = '';
			}
		}

		return lines.join('\n');
	};

	flatten = async (fileObjects, path) => {
		const visited = new Set();

		const result = await this.visit(path, visited, fileObjects);

		return `
/* ===============================================
 * Flattened with Solidifier by Coinage
 * 
 * https://solidifier.coina.ge
 * ===============================================
*/


${result}
`;
	};

	// Depth first visit just like the solidity compiler.
	visit = async (path, visited, fileObjects) => {
		if (visited.has(path)) return '';
		visited.add(path);

		let contents = await this.getFileContents(path, fileObjects[path]);
		const importStatements = this.getImportsInFile(contents);

		// Remove the import statements first so the line numbers match up.
		for (const importStatement of importStatements) {
			contents = this.removeByLoc(contents, importStatement.loc);
		}

		// Now flatten and jam onto the top of the file.
		let contentsToAppend = '';

		for (const importStatement of importStatements) {
			contentsToAppend += await this.visit(importStatement.path, visited, fileObjects);
		}

		return contentsToAppend + contents;
	};
}
