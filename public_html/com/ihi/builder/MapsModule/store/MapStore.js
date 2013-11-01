/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define("MapsModule.store.MapStore",{
    extend: "Ext.data.Store",
    
    config: {
        autoload: false,
        model: "MapsModule.model.MapModel"
    }
});
