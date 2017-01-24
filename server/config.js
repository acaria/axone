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
		node: parseInt(process.env.NODE_PORT) || 7250,
		bs: process.env.PROXY_PORT || 7251,
		bsUi: 7252,
		mongo: parseInt(process.env.MONGO_PORT) || 7227
	},

	mongo: {
		user: '', pass: '',
		uri: process.env.MONGO_URI || 'localhost',
		db: 'axone',
		debug: parseInt(process.env.MONGO_DEBUG) || !(process.env.NODE_ENV && process.env.NODE_ENV === 'production')
	},

	storage: {
		avatar: "storage/avatar",
		picture: "storage/picture",
		uploads: "uploads",
	}
};