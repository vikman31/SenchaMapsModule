/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define("MapsModule.model.MapModel",{
    extend: "Ext.data.Model",
    
    config: {
        fields: [
            {name: 'title',  type: 'string'},
            {name: 'address',  type: 'string'},
            {name: 'logo',  type: 'string'}
        ]
    }
});

