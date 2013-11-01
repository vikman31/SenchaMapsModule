/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define("MapsModule.view.MainView",{
    extend: 'Ext.navigation.View',
    xtype: 'mainview',
    
    config: {
        id: 'mainView',
        instanceId: '',
        moduleId: '',
        fullscreen: true,
        
        navigationBar: {
            
        },
        templateManager: {
            
        },
        scrollable: {
            direction: 'vertical', 
            directionLock: true
        },
        
        items: [
            {
                xtype: 'placeslist'
            }
        ]
    }
});
