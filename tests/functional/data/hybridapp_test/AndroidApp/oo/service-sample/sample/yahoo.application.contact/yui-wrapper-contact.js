YUI.add('contact', function(Y) {

/**
 * Provides interfaces for retrieving contact data.
 * @module contact
 */

/**
 * The Contact class provides interfaces for accessing contact data.
 *
 *      YUI().use('contact', function(Y) {
 *
 *          // success callback
 *          function success(o) {
 *              var items = o.list;
 *	            var liststring = "";
 *              for( i=0; i<items.length; i++){
 *	                   liststring += ( items[i].name + "," );
 *              }
 *          }
 *
 *          // failure callback (optional)
 *          function failure(error) {
 *              var code    = error.code,
 *                  message = error.message;
 *          }
 *          // get phone contacts list
 *          Y.Contact.getContacts(success, failure);
 *
 *      });
 *
 * @class Contact
 * @static
 */
var Contact = Y.namespace('Contact');

/**
 * Constants for use with the failure callback argument's `code` field.
 *
 * Available values:
 *
 *      Y.Contact.ERROR.OK
 *      Y.Contact.ERROR.CONTACT_UNAVAILABLE
 *
 * @property ERROR
 * @type Object
 * @static
 */
Contact.ERROR = {
    OK: 0,
    CONTACT_UNAVAILABLE: 1,
};

/**
 * Requests contact data and passes it to the success callback.
 * If the call fails, error data is passed to the (optional) failure callback.
 *
 * @method getContacts 
 * @static
 * @param {Function} success The callback to run if the call succeeds.
 *  @param {Object} success.contact The argument passed to the success callback.
 *      @param {Array} success.acceleration.list Contacts list.
 * @param {Function} [failure] The callback to run if the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 * See <a href="#property_ERROR">Y.Contact.ERROR</a> for the full list of supported constants.
 *      @param {String} failure.error.message A message explaining the error.
 * @return {String} The invocationId returned from the bridge.
 */
Contact.getContacts = function(success, failure) {
    return Y.Handle.send('sContact', 'getContacts', success, failure);
};


}, '@VERSION@' ,{requires:['handle']});
