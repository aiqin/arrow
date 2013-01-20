package com.yahoo.platform.ychrome.service.contact;

import org.json.JSONObject;

import com.yahoo.platform.mobile.ychromert.RTDomain;
import com.yahoo.platform.mobile.ychromert.kernel.RTCall;
import com.yahoo.platform.mobile.ychromert.service.RTServiceInterface;

public class RTContactServiceInterface extends RTServiceInterface{

	private RTContactService mService;
	
	public RTContactServiceInterface(RTContactService service, JSONObject idl, RTDomain domain) {
		super(service, idl, domain);
        mService = service;
	}
	
	public void getContacts(RTCall call, JSONObject params) {
        mService.getContacts(call, params);
    }

}
