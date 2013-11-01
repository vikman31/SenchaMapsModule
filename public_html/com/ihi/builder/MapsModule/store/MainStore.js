/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define("MapsModule.store.MainStore",{
    extend: "Ext.data.TreeStore",
    
    config: {
        autoload: false,
        model: "MapsModule.model.MainModel",
        storeId: 'MyJsonTreeStore',
        xtype: "mapsStore",
        
        proxy: {
            type: "ajax",
            noCache: false,
            url: "com/ihi/builder/MapsModule/__module.json",
            
            reader: {
                type: "json",
                rootProperty: "children"
            }
        }
    }
});
