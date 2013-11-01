/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define("MapsModule.view.PlacesList",{
    extend: 'Ext.List',
    xtype: 'placeslist',
    
    config: {
        store: 'MapStore',
        id: 'placesList',
        title: 'Maps Module',
        itemTpl: '<img src="{logo}" height="50" width="50" style="float: left; margin-right: 10px;"/> <b>{title}</b> <br> {address}'
    }
});
