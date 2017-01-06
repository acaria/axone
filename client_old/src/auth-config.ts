export default {
	endpoint: 'auth',
	configureEndpoints: ['auth', 'api'],
	
	baseUrl: '',
	loginUrl: 'login',
	logouturl: null,
	logoutMethod: 'get',
	signupUrl: 'signup',
	profileUrl: 'me',
	profileMethod: 'put',
	unlinkUrl: null,
	unlinkMethod: 'get',
	
	loginOnSignup: true,
	loginroute: '/login',
	loginRedirect: '#/profile',
	signupRedirect: '#/login',
	logoutRedirect: '#/login',
   expiredRedirect: true,
   
   authHeader: 'Authorization',
   authTokenType: 'Bearer',
   accessTokenProp: 'token',

   storage: 'localStorage',
   storageKey: 'axone_authentification',
   storageChangedReload: false,

   providers: {
   	google: {
  			url: 'google',
   		clientId: '239531536023-ibk10mb9p7ullsw4j55a61og5lvnjrff6.apps.googleusercontent.com'
		},
		facebook: {
			url: 'facebook',
			clientId: '1465278217541708498'
		}
	}
};