/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.application({
    name: 'MapsModule', //namespace
    appFolder: 'com/ihi/builder/MapsModule', //path of the app folder
    
    views: ['MainView', 'MapView', 'PlacesList'],
    controllers: ['MainController'],
    models: ['MainModel', 'MapModel'],
    stores: ['MainStore', 'MapStore'],
    helpers: ['MainHelper'],
    
    launch: function(){
        var view = Ext.create("MapsModule.view.MainView");
    }

});