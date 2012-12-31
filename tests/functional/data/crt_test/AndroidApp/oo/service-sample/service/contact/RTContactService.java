package com.yahoo.platform.ychrome.service.contact;

import java.util.EnumSet;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;
import android.util.Log;

import com.yahoo.platform.mobile.ychromert.RTError;
import com.yahoo.platform.mobile.ychromert.RTGroup;
import com.yahoo.platform.mobile.ychromert.dispatch.RTTask;
import com.yahoo.platform.mobile.ychromert.kernel.RTCall;
import com.yahoo.platform.mobile.ychromert.kernel.RTCallResult;
import com.yahoo.platform.mobile.ychromert.kernel.RTHandle;
import com.yahoo.platform.mobile.ychromert.kernel.RTKernel.RTServiceSetupFlag;
import com.yahoo.platform.mobile.ychromert.service.RTIDLCreator;
import com.yahoo.platform.mobile.ychromert.service.RTService;
import com.yahoo.platform.ychrome.service.IDL.RTContactServiceIDL;

public class RTContactService extends RTService {
	

	/**
	 *  {All service required} 
	 *  Service member variables
	 */
    private RTContactServiceInterface mInterface;
    private RTHandle mHandle;
    
	/**
	 *  [All service optional, highly recommend] 
	 *  class static string constant
	 *  	using these constant to confirm consistent referencing
	 */
    private final static String TAG = "RTContactService";
    public final static String HANDLE_CONTACT = "sContact";

    /**
     *  [All service optional]
     *  Error code and error message been returned in failure callback
     */
    public final static int ERR_INTERNAL = -1;
    public final static int ERR_CONTACT_UNKNOW = 1;

    private final static String[] ERROR_MESSAGES = { "no error",
            "Contact information unknown or not available."};

    
    /**
     *  {This service required}
     *  ContentResolver object to query contacts information from Android
     */
    private ContentResolver mCR;
    
    /**
     *  [This service optional]
     *  This service functionality-related class static string constant
     */
    private final static String[] PROJECTION = new String[] {
	        ContactsContract.Contacts._ID,
	        ContactsContract.Contacts.DISPLAY_NAME
	};
	private final static Uri URI = ContactsContract.Contacts.CONTENT_URI;
	private final static String SELECTION = ContactsContract.Contacts.IN_VISIBLE_GROUP + " = '1'";
	private final static String SORTORDER = ContactsContract.Contacts.DISPLAY_NAME + " COLLATE LOCALIZED ASC";
	
	private final static String KEY_ID = "id";
	private final static String KEY_NAME = "name";
	private final static String KEY_LIST = "list";

	
    public RTContactService() {

        JSONObject idl = RTIDLCreator
                .createIDLWithString(RTContactServiceIDL.contactServiceIDLString);
        
        mInterface = new RTContactServiceInterface(this, idl, mDomain);
        mHandle = new RTHandle(mInterface, null);
        
        mCR = sEnvironment.getApplication().getContentResolver();
    }

    
    /**
     *  {All service required}
     *  Implement 3 abstract method in RTService
     */
	@Override
	public String getID() {
		return HANDLE_CONTACT;
	}

	@Override
	public RTHandle getMainInterfaceHandle() {
		return mHandle;
	}

	@Override
	protected void enterSetup(EnumSet<RTServiceSetupFlag> flags, RTGroup group) {
		
	}

	
	/**
	 *  {This service functionality}
	 *  getContacts function use ContentResolver to query contacts info from device
	 *  		a cursor is returned after querying, then call notifyContacts to convert
	 *  		data in cursor as 
	 *  
	 * @param call
	 * @param params
	 */
    public void getContacts(final RTCall call, JSONObject params) {
    	AsyncExecute(new RTTask(RTContactService.this){

			@Override
			public void run() {
				// Run query contacts id and display_name
				Cursor cursor = mCR.query(URI, PROJECTION, SELECTION, null, SORTORDER);
		        Log.i(TAG, "getContacts(): ContentResolver.query complete.");
		        
		        notifyResult(call, cursor);
			}
    		
    	});
    }

    /**
     * {This service functionality}
     * notifyResult function was called to send contact data to JS via callback
     * 
     * @param call - RTcall object which used to send callback
     * @param cursor - database cursor to retrieval contact data
     */
    private void notifyResult(RTCall call, Cursor cursor) {
    	
        RTCallResult ret = new RTCallResult();
        
        JSONObject value = new JSONObject();
        JSONArray listvalue = new JSONArray();
        
        if (cursor == null ){
            RTError error = getContactError(ERR_CONTACT_UNKNOW, null);
            ret.mResultName = RTCallResult.DEFAULT_FAILURE_CALLBACK;
            value = error.createErrorJSONObject();
            Log.e(TAG, "notifyResult() : cursor=null");
        }
        else {
        	try{
        		ret.mResultName = RTCallResult.DEFAULT_SUCCESS_CALLBACK;
        		
	            if  (cursor.moveToFirst()) {
	                do {
	                	JSONObject jsonobj = new JSONObject();
	                	jsonobj.put(KEY_ID, cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts._ID)));
	                	jsonobj.put(KEY_NAME, cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME)));
	                	
	                	listvalue.put(jsonobj);
	                }while (cursor.moveToNext());
	            }
	            
	            value.put(KEY_LIST, listvalue);
	            Log.i(TAG, "notifyResult() : contact list=" + value.toString());
	            
        	}catch(JSONException e) {
	            ret.mResultName = RTCallResult.DEFAULT_FAILURE_CALLBACK;
	            RTError error = getContactError(ERR_INTERNAL, null);
	            value = error.createErrorJSONObject();
	            Log.e(TAG, "notifyResult() : exception-" + e);
	            
        	}finally{
        		cursor.close();
        	}
        }
        ret.mResultValue = value;
        call.mCallback.onComplete(ret);

    }


	
	/**
	 *  {All service optional}
	 *  getContactError function was called to create RTError object
	 *  		when there is an error occur and want to response it to JS call,
	 *  		we need to create RTError object with 
	 *  			domain (String) 
	 *  			error code (int)
	 *  			error messages array (String[]), using error code to index errro message
	 *  			errorDetail (JSONObject)
	 *  
	 * @param errorCode
	 * @param errorDetail
	 * @return RTError
	 */
	RTError getContactError(int errorCode, JSONObject errorDetail) {
	        return new RTError("sContact", errorCode, ERROR_MESSAGES, errorDetail);
	}
}
