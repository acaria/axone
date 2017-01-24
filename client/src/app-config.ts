let env = process.env.NODE_ENV;

export default {
	endPoint: {
		baseUrl: (env == 'production') ? 'http://acasrv:7250/' : 'http://localhost:7251/',
		auth: 'auth/',
		api: 'api/'
	},

	storage: {
		baseUrl: (env == 'production') ? 'http://acasrv:7250/' : 'http://localhost:7251/',
		avatar: 'avatar/',
		picture: 'picture/'
	}
}
