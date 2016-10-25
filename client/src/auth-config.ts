export default {
	endpoint: 'auth',
	configureEndpoints: ['auth', 'api'],
	baseUrl: '',
	loginUrl: 'login',
	signupUrl: 'signup',
	profileUrl: 'me',
	unlinkUrl: 'unlink',
	loginOnSignup: true,
   storageChangedReload: 1,
   expiredRedirect: 1,
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