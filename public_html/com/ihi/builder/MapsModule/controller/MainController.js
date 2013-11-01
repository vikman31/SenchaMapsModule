/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define("MapsModule.controller.MainController",{
    
    extend: "Ext.app.Controller",
    requires: ["MapsModule.helper.MainHelper", "Ext.Map"],
    
    config: {
        id: 'mainControl',
        moduleTitle: '',
        moduleId: '',
        jprops: 'null',
        children: 'null',
        latiLongi: null,
        titleAddress: null,
        descriptionAddress: null,
        latitude: null,
        longitude: null,
        logo: null,
        errorCenter: false,
        templateManager: {
            
        },
        
        refs: {
            mainView: '#mainView',
            placesList: '#placesList',
            myMap: 'map',
            mapView: '#mapView'
        },
        control: {
            mainView: {
                initialize: 'onMainInitialize'
            },
            placesList: {
                itemtap: 'onItemTap'
            },
            myMap: {
                centerchange: 'errorCentering',
                maprender: 'onMapRender'
            }
        }
    },
    
    //Fires this event when the map is not centered, it only works at the first time because there is a bug
    //when the user tap an address inmediatly after the main view is showed, so if the user tap an address
    //after a few seconds of starting the main view this event won't be fired
    errorCentering: function(component){
        //this condition only will be false at the first time that the center of the map is wrong
        if(this.getErrorCenter() === false){
            this.setErrorCenter(true); //change the var to avoid show this message every time that the user moves the map
            var centerError = Ext.create("Ext.Panel",{
                centered: true,
                modal: true,
                height: 200,
                width: 350,
                html: "<br>Error centering the map for your address.<br>Please go back and try again."
            });
            component.add(centerError);
        }
    },
    
    //Fires this event when the main view has been initialized
    onMainInitialize: function(component){
        var store = Ext.create("MapsModule.store.MainStore"); //Instantiate the descriptore store class       
        
        var iid = component.getInstanceId(); //get the module class instance id
        
        var me = this; //save the main panel
        
        this.setTemplateManager(component.getTemplateManager()); //pass the templateManager from the mainView
        
        //set the new proxy based on iid
        store.setProxy({
            type: 'ajax',
            noCache: false,
            url: 'com/ihi/builder/MapsModule/__module' + iid + '.json',
            reader: {
                type: 'json',
                rootProperty: 'children'
            }
        });

        //Load the configurations into the store
        store.load({
            scope: this,
            //EN ESTE CALLBACK YA TIENES ACCESO A LAS PROPIEDADES DEL .JSON
            callback: function(records, operation, success) {
                if(success){
                    //Create helper to read the json
                    var helper = Ext.create("MapsModule.helper.MainHelper");
                    
                    var rootNode = helper.nodeToJSON(records[0]); //Get the root node
                    
                    this.setModuleTitle(rootNode.text); //save the module title
                    
                    //print the root node
                    //console.debug('root node: ',rootNode);//////////////        
                    
                    helper.treeToJSON(records[0], rootNode); //Get the properties (text and buttons for eg);
                    
                    me.setChildren(rootNode.children); //get the properties of the childs nodes and set to the var children
                    
                    me.setModuleId(rootNode.arrproperties[3]); //get the module title
                    
                    setView(me); //call this function to set the view of the module
                    
                } else {
                    console.log('There was a problem loading the json descriptor');
                }
            }
        });
    },
    
    //Fires the event when an address of the list is selected
    onItemTap: function(list, index, target, record){
        var geocoder = new google.maps.Geocoder(); //var to determinate the position with the address
        var address = record.get('address'); //get the address of the items selected record
        var me = this; //save the controller
        
        this.setDescriptionAddress(address); //save the address in the controller's var
        this.setTitleAddress(record.get('title')); //save the place in the controller's var 
        this.setLogo(record.get('logo')); //save the logo in the controller's var
        
        // create a new map
        var myMap = Ext.create("Ext.Map", {
            id: 'mapa',
            useCurrentLocation: false,
            height: '100%',
            width: '100%',
                    
            mapOptions: {
                zoom: 17,
                minZoom: 13,
                maxZoom: 19,
                center: null
           }
        });
        //call the geocode service to get the lat and long of the place to center the map and put the marker
        geocoder.geocode( {'address': address}, function(results, status){
            if (status === google.maps.GeocoderStatus.OK) {
                me.setLatiLongi(results[0].geometry.location); //save the latitude and longitude in the controller's vat
                //center the map according to the lat and long
                myMap.config.mapOptions.center = new google.maps.LatLng(me.getLatiLongi().lat(), me.getLatiLongi().lng());
                //just a flag to know that the center has been changed succesful and don't show the centerError panel
                me.setErrorCenter(true);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
        //create the view that will contain the map and add a map to its items
        var mapView = Ext.create("MapsModule.view.MapView", {
            items: [myMap]
        });
        
        var tplManager = this.getTemplateManager(); //save the template manager
        
        var navigationView = this.getMainView(); //save the main view
        
        var moduleTitle = this.getModuleTitle(); //save the module title
        
        //validate if the json contain an address
        if(this.getDescriptionAddress() !== "Undefined"){
            //function to check if the module is running into a template or in standalone mode
            validateTemplate(tplManager, mapView, navigationView, moduleTitle);
        }else{
            //show a floating panel with the error
            Ext.create('Ext.Panel', {
                html: 'No address are defined! Try with another place.',
                padding: 10,
                modal: true
            }).showBy(target);
            //quit the panel error after 2 seconds
            Ext.Function.defer(function(){
                var panelError = Ext.ComponentQuery.query('panel[padding=10]');
                panelError[0].destroy();
            }, 2000);
        }
    },
            
    //Fires when the map is rendered or created
    onMapRender: function(map){
        var me = this; 
        //create a new marker
        var marker = new google.maps.Marker({
            visible: true,
            animation: google.maps.Animation.DROP,
            cursor: 'pointer', 
            map: Ext.ComponentManager.get('mapa').getMap(), //set the marker to the map that we have in the view
            position: new google.maps.LatLng(me.getLatiLongi().lat(), me.getLatiLongi().lng()) //put the marker in the address
        });
        
        this.setLatitude(me.getLatiLongi().lat()); //save the latitude in the controller's var
        this.setLongitude(me.getLatiLongi().lng());
        
        //this will contain the html that will have the infoWindow
        var htmlContent = '<img height="100" width="100" style="float: right; margin-left: 5px;" src="' + 
                this.getLogo() + '"/>' + '<b>Place:</b> ' + this.getTitleAddress() + '<br><b>Address:</b> ' + 
                this.getDescriptionAddress() + '<br><b>Latitude:</b> ' + this.getLatitude() + '<br><b>Longitude:</b> ' + this.getLongitude()
        
        //create a infoWindow that will display information of the place
        var infowindow = new google.maps.InfoWindow({
            content: htmlContent,
            maxWidth: 380
        });
        
        //Add a event that will display a infoWindow when a marker is tapped
        google.maps.event.addListener(marker, 'click', function() {    
            infowindow.open(Ext.ComponentManager.get('mapa').getMap(), marker);
        });
    }
    
});

//function to initialize the view
function setView(me){
    //local var to save the data
    var title = "", address = "", logo = "";
    
    //Get the records of the json that we saved in the controller's var children that have information 
    //like the name of the place, the address and the icon
    for(var i=0; i<me.getChildren().length; i++){
        title = me.getChildren()[i].arrproperties[0];
        address = me.getChildren()[i].arrproperties[1];
        logo = me.getChildren()[i].arrproperties[2];
        
        //these are conditions to make an item like undefined if a record doesn't have information
        if(title === "") title = "Undefined";
        if(address === "") address = "Undefined";
        if(logo === "") logo = "com/ihi/builder/MapsModule/resource/images/error.gif";
        
        //set the information of every item of the list
        me.getPlacesList().setData(
            {
                title: title, 
                address: address, 
                logo: logo
            }
        );
    }
}

//function to check if the module is running into a template or in standalone mode
function validateTemplate(tplManager, mapView, navigationView, moduleTitle){
    //we put this try-catch to run the module into a template or in standalone mode
    //because if the module haven't been instantiated by the builder, the methods getTplObject() or getSubTplObj()
    //doesn't exist and it will generate an error and we catch it, so we know that the module is standalone
    try{
        //if we don't have a template object
        if ( !Ext.isEmpty( tplManager.getTplObject() || !Ext.isEmpty(tplManager.getSubTplObj()) ) ) {
            //create a class that will detect if the device is a phone or a tablet or a desktop
            var deviceManager = Ext.create("common.DeviceManager.DeviceManager");
            
            if (deviceManager.getIsPhone()) {
                tplManager.setType("navigationview"); //push a new navView to the template's view
                tplManager.setNewView(mapView); //set a Map View and push it to the template's view

            } else if (deviceManager.getIsTablet() || deviceManager.getIsDesktop()) {
                tplManager.setType("navigationview");
                tplManager.setSubTplObject(navigationView);
                tplManager.setSubTemplate(true);
                tplManager.setSubTplTitle(moduleTitle); //set the module title
                tplManager.setNewView(mapView);
            }
        } else {
            navigationView.push(mapView); //make a push to the module view
        }
    } catch (ex) {
        console.debug("Module is Running in Standalone Mode", ex);
        navigationView.push(mapView); //make a push to the module view
    }
}