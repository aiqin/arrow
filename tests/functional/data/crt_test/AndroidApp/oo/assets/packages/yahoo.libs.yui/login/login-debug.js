YUI.add('login', function (Y, NAME) {

/**
 * Provides an abstraction for Y! login.
 * @module login
 */

/**
 * The Login class provides access to login data.
 *
 *      YUI().use('login', function(Y) {
 *
 *       });
 *
 *
 * @class Login
 * @static
 */
var Login = Y.namespace('Login');

/**
 * Constants for use with the failure callback argument's `code` field.
 *
 * Available values:
 *      Y.Login.ERROR.INVALID_STATE
 *      Y.Login.ERROR.UNSUPPORTED_METHOD
 *
 * @property ERROR
 * @type Object
 * @static
 */
Login.ERROR = {
    INVALID_STATE:1,
    UNSUPPORTED_METHOD:2
};

 /**
  * Constants for use with the authError callback argument's `code` field.
  *
  * Available values:
  *      Y.Login.AUTH_ERROR.UNABLE_TO_GET_TOKEN
  *      Y.Login.AUTH_ERROR.UNABLE_TO_GET_COOKIES
  *      Y.Login.AUTH_ERROR.GENERAL_ERROR
  *      Y.Login.AUTH_ERROR.USER_DB_IS_DOWN
  *      Y.Login.AUTH_ERROR.INVALID_CREDENTIALS
  *      Y.Login.AUTH_ERROR.ANTIBOT_STATE
  *      Y.Login.AUTH_ERROR.ANTIBOT_STATE_MAX_TRIES
  *      Y.Login.AUTH_ERROR.ACCOUNT_LOCKED
  *      Y.Login.AUTH_ERROR.SPECIAL_HANDLING_REQUIRED
  *      Y.Login.AUTH_ERROR.INVALID_USER_ID
  *      Y.Login.AUTH_ERROR.SYSTEM_IS_DOWN
  *
  * @property AUTH_ERROR
  * @type Object
  * @static
  */
 Login.AUTH_ERROR = {
    UNABLE_TO_GET_TOKEN:1,
    UNABLE_TO_GET_COOKIES:2,
    GENERAL_ERROR:100,
    USER_DB_IS_DOWN:200,
    INVALID_CREDENTIALS:1212,
    ANTIBOT_STATE:1213,
    ANTIBOT_STATE_MAX_TRIES:1214,
    ACCOUNT_LOCKED:1218,
    SPECIAL_HANDLING_REQUIRED:1221,
    INVALID_USER_ID:1235,
    SYSTEM_IS_DOWN:1236
 };

Login._serviceId = 'sLogin';

/**
 * Allows for the assigning of callbacks to various moments of the login process.
 *
 * @method watchNativeLogin
 * @static
 * @param {Object} callbacks A hash of callbacks.
 *  @param {Funtion} callbacks.requireUserNameAndPassword A callback to indicate
 *  that watcher should display UI to enter username/password.
 *  @param {Function} callbacks.loggingIn Inform the watcher that login has begun.
 *  The UI could use this to show some activity indicator.
 *   @param {Object} loggingIn.login The argument passed to the loggingIn callback.
 *      @param {String} loggingIn.login.user The id of the user who is logging in.
 *  @param {Function} callbacks.authError Informs the watcher that login failed
 *  due to invalid credentials.
 *   @param {Object} authError.error The argument passed to the authError callback.
 *      @param {Number} authError.error.code The error code.
 *  @param {Function} callbacks.loggedIn Informs the watcher that login is complete.
 *  The UI could be dismissed at this point if appropriate.
 *   @param {Object} loggedIn.login The argument passed to the loggedIn callback.
 *      @param {String} loggedIn.login.user The id of the user who is logging in.
 *  @param {Function} callbacks.failure Informs the watcher that the login failed.
 *  Note that this cancels the watch.
 *   @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 * @return {String} The invocationId returned from the bridge.
 */
Login.watchNativeLogin = function(callbacks) {
    return Y.Bridge.invokeMethod(Login._serviceId, 'watchNativeYahooLogin', null, callbacks);
};

/**
 * Allows for the assigning of callbacks to various moments of the login process.
 *
 * @method watchWebLogin
 * @static
 * @param {Object} callbacks A hash of callbacks.
 *  @param {Funtion} callbacks.requireUserNameAndToken Display the webpage at
 * the given URL. Extract the token from the response and call setUserNameAndToken.
 *   @param {Object} requireUserNameAndToken.login The argument passed to the
 *  requireUserNameAndToken callback.
 *      @param {String} requireUserNameAndToken.login.url The URL to the login
 *      page with the right src set. The watcher is supposed to display this URL,
 *      allow the user to enter username/password and then call the service back
 *      with the token.
 *  @param {Function} callbacks.loggingIn Inform the watcher that login has begun.
 *  The UI could use this to show some activity indicator.
 *   @param {Object} loggingIn.login The argument passed to the loggingIn callback.
 *      @param {String} loggingIn.login.user The id of the user who is logging in.
 *  @param {Function} callbacks.authError Informs the watcher that login failed
 *  due to invalid credentials.
 *   @param {Object} authError.error The argument passed to the authError callback.
 *      @param {Number} authError.error.code The error code.
 *  @param {Function} callbacks.defendedCookies Informs the watcher that login
 *  service prevented cookie from being removed from the cookie jar. This can
 *  happen if the user navigates to a page on Y! network that has a Sign-Out
 *  link. The watcher may want to trap this and display some UI to check if the
 *  user really meant to Sign Out of Y!
 *  @param {Function} callbacks.loggedIn Informs the watcher that login is complete.
 *  The UI could be dismissed at this point if appropriate.
 *   @param {Object} loggedIn.login The argument passed to the loggedIn callback.
 *      @param {String} loggedIn.login.user The id of the user who is logging in.
 *  @param {Function} callbacks.cancel Informs the watcher that the login was
 *  cancelled.  The UI could be dismissed at this point if appropriate.
 *  @param {Function} callbacks.failure Informs the watcher that the login failed.
 *  Note that this cancels the watch.
 *   @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 * @return {String} The invocationId returned from the bridge.
 */
Login.watchWebLogin = function(callbacks) {
    return Y.Bridge.invokeMethod(Login._serviceId, 'watchWebLogin', null, callbacks);
};

/**
 * Call this method to setup a watcher that can track a login session.
 *
 * @method watchSession
 * @static
 * @param {Object} callbacks A hash of callbacks.
 *  @param {Function} callbacks.loggedOut Inform the watcher that user has logged out.
 *   @param {Object} loggedOut.login The argument passed to the loggedOut callback.
 *      @param {String} loggedOut.login.user The id of the user who logged out.
 *  @param {Function} callbacks.acquiringPassword Informs the watcher that a
 *  password is being acquired.
 *  @param {Function} callbacks.acquiringToken Informs the watcher that a
 *  token is being acquired.
 *   @param {Object} acquiringToken.login The argument passed to the
     acquiringToken callback.
 *      @param {String} acquiringToken.login.user The id of the user.
 *  @param {Function} callbacks.acquiringCookies Informs the watcher that
 *  cookies are being acquired.
 *   @param {Object} acquiringCookies.login The argument passed to the
     acquiringCookies callback.
 *      @param {String} acquiringCookies.login.user The id of the user.
 *  @param {Function} callbacks.refreshingCookies Informs the watcher that
 *  cookies are being refreshed.
 *   @param {Object} refreshingCookies.login The argument passed to the
     refreshingCookies callback.
 *      @param {String} acquiringCookies.login.user The id of the user.
 *   @param {Object} authError.error The argument passed to the authError callback.
 *      @param {Number} authError.error.code The error code.
 *  @param {Function} callbacks.loggedIn Informs the watcher that login is complete.
 *  The UI could be dismissed at this point if appropriate.
 *   @param {Object} loggedIn.login The argument passed to the loggedIn callback.
 *      @param {String} loggedIn.login.user The id of the user who is logging in.
 *  @param {Function} callbacks.cookiesExpired
 *  @param {Function} callbacks.idle
 *  @param {Function} callbacks.defendedCookies
 * @return {String} The invocationId returned from the bridge.
 */
Login.watchSession = function(callbacks) {
    return Y.Bridge.invokeMethod(Login._serviceId, 'watchSession', null, callbacks);
};

/**
 * Starts the login process. The session callback needs to be registered to be
 * notified about the loggedIn or loggedOut state if the loggedOut callback is
 * invoked on the sessionWatcher then beginLogin must be invoked.
 *
 * @method start
 * @static
 * @param {Function} [success] The callback to run if the call succeeds.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 * TODO: Replace "details" with "detail" in other APIs (geo, compass, etc.).
 *      @param {Object} failure.error.detail Additional error information.
 * @return {String} The invocationId returned from the bridge.
 */
Login.start = function(success, failure) {
    return Y.Bridge.invokeMethod(Login._serviceId, 'start', null, {
        success: success,
        failure: failure
    });
};

 /**
 * Begins the login process by driving the UI watcher. This should be invoked
 * only when loggedOut callback is received on the session watcher.
 * The watchNativeLogin method should be invoked before this.
 *
 * @method beginLogin
 * @static
 * @param {Function} [success] The callback to run if the call succeeds.
 * @param {Function} [failure] The callback run if the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 * @param {Object} options The options to pass to the host method
 *      @param {String} options.type (should be nativeYahoo)
 * @return {String} The invocationId returned from the bridge
 */
 Login.beginLogin = function(success, failure, options) {
     return Y.Bridge.invokeMethod(Login._serviceId, 'beginLogin', options, {
        success: success,
        failure: failure
     });
 };

/**
 * Login to Yahoo! and obtain cookies given username and password. This should be
 * invoked as a response to requireUserNameAndPassword.
 *
 * @method setUserNameAndPassword
 * @static
 * @param {Function} [success] The callback to run if the call succeeds.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @param {Object} options The options to pass to the host method.
 *   @param {String} options.user A valid user ID.
 *   @param {String} options.password Password in clear text for the user
 *   specified in the request.
 * @return {String} The invocationId returned from the bridge.
 */
Login.setUserNameAndPassword = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Login._serviceId, 'setUserNameAndPassword', options, {
        success: success,
        failure: failure
    });
};

/**
 * Login to Yahoo! and obtain cookies given username and token. This should be
 * invoked as a response to requireUserNameAndToken. The token could be obtained
 * by user entering Yahoo/OpenID credentials.
 *
 * @method setUserNameAndToken
 * @static
 * @param {Function} [success] The callback to run if the call succeeds.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @param {Object} options The options to pass to the host method.
 *   @param {String} options.user A valid user ID.
 *   @param {String} options.token The token issued by Yahoo! login servers in
 *   exchange for user credentials.
 * @return {String} The invocationId returned from the bridge.
 */
Login.setUserNameAndToken = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Login._serviceId, 'setUserNameAndToken', options, {
        success: success,
        failure: failure
    });
};

/**
 * Logout the currently logged in user.
 *
 * @method logout
 * @static
 * @param {Function} [success] The callback to run when the logout succeeds.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @return {String} The invocationId returned from the bridge.
 */
Login.logout = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Login._serviceId, 'logout', options, {
        success: success,
        failure: failure
    });
};

/**
 * Cancel the login process. Must be called from acquiringPassword,
 * acquiringToken, or acquiringCookies.
 *
 * @method cancel
 * @static
 * @param {Function} [success] The callback to run when the logout succeeds.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @return {String} The invocationId returned from the bridge.
 */
Login.cancel = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Login._serviceId, 'cancel', options, {
        success: success,
        failure: failure
    });
};

/**
 * Signals the host to stop sending change notifications.
 * @method clearWatch
 * @static
 * @param {String} invocationId The id of the watch to be removed.
 * @param {Function} [success] The callback to run when the watch is successfully cleared.
 * @param {Function} [failure] The callback to run when the watch fails to be cleared.
 *
 */
Login.clearWatch = function(invocationId, success, failure) {
    Y.Bridge.cancelMethod(invocationId, success, failure);
};


}, '@VERSION@', {"requires": ["bridge"]});
