import * as fs from "fs";
import * as path from "path";
import * as toml from "toml";
import * as util from "./util";
type ops = {
	db:  {
		mode: 'fs',
		path: string
	} | {
		mode: 'repl.it',
		key: string
	} | {
		mode: 'mongo',
		url: string
	} | {
		mode: 'fs'| 'repl.it' | 'mongo',
		path: string,
		key: string,
		url: string
	}
	crypto: {
		pepper: string
	}
	/**
	 * make sure to not use console.log on this because toml parses each of these to have a null prototype
	 */
	changelog: {
		date: string,
		title: string,
		body: string
	}[]
	staticFiles: boolean,
	tps: number,
	port: number,
	title: string,
	description: string,
}
const defaultOps: ops = {
	port: 80,
	tps: 1,
	staticFiles: true,
	title: 'the travelers',
	description: 'a text-based adventure mmo',
	db: {
		mode: 'fs',
		path: './db.json',
		key: 'default',
		url: 'mongodb://localhost:27017'
	},
	crypto: {
		pepper: util.randomString(50)
	},
	changelog: []
};
const file = fs.readFileSync(path.join(util.root, 'config.toml')).toString();
const options: ops = util.mergeObject(defaultOps, toml.parse(file));
// toml has null prototype objects for some reason
const newLogs: typeof options.changelog = [];
for(const log of options.changelog) {
	newLogs.push({
		title: log.title,
		body: log.body.trim(),
		date: log.date
	});
}
options.changelog = newLogs;
if(options.crypto.pepper === defaultOps.crypto.pepper) {
	util.debug('WARN', 'No password pepper found. Defaulting to a random string. This will not allow users to log in after a restart.');
}
export = options;