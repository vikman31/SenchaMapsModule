/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define("MapsModule.model.MainModel",{
    extend: "Ext.data.Model",
    
    config: {
        fields: [
            {
                name: 'text'
            },
            {
                name: 'properties'
            },
            {
                name: 'private_properties'
            },
            {
                name: 'configuration'
            },
            {
                name: 'uuid'
            }
        ]
    }
});
