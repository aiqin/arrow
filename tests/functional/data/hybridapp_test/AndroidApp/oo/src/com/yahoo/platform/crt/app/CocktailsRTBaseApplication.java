package com.yahoo.platform.crt.app;

import java.util.HashMap;

import com.yahoo.platform.mobile.crt.app.RTApplication;
import com.yahoo.platform.mobile.crt.service.RTService;

public class CocktailsRTBaseApplication extends RTApplication
{
	 protected HashMap<String, RTService> customizeServices(){
		 HashMap<String, RTService> services = super.customizeServices();
		 
		 /*
		  * Add your own services here
		  * [example]
		  * 	RTContactService contact = new RTContactService();
		  * 	services.put( contact.getID(), contact );
		  */
		 
		 /*
		  * Remove CocktailsRT default services here
		  * [example]
		  * 	services.remove("sCamera") // remove camera service
		  */
		 
		 /*
		  * The return services are which YChromeRT will register 
		  */
		 return services;
	 }
}
