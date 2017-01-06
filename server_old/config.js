module.exports = {
	secret: "ajras",

	tokenRef: "user_id",

	path: {
		files: {
			js: ['./src/**/*.js'],
			ts: ['./src/**/*.ts'],
			ejs: ['./view/**/*.ejs']
		},
		dir: {
			db: './data',
			src: './src',
			dest: './build',
			client: '../client/dist',
			view: './view'
		}
	},

	uri: process.env.NODE_URI || 'localhost',

	env: process.env.NODE_ENV || 'development',

	port: {
		node: parseInt(process.env.PORT) || 8080,
		bs: 4000,
		bsUi: 4001,
		mongo: parseInt(process.env.MONGO_PORT) || 5050
	},

	mongo: {
		uri: process.env.MONGO_URI || 'localhost',
		db: 'axone',
		debug: true
	},

	storage: {
		avatar: "storage/avatar",
		picture: "storage/picture",
		uploads: "uploads",
	}
};