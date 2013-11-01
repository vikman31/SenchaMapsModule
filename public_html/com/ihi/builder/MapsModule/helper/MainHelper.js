/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define("MapsModule.helper.MainHelper", {
    
     treeToJSON: function(rootNode, jo) {
              
        if (rootNode.hasChildNodes()) {
            var childNodes = rootNode.childNodes;
            jo.children = [];
            for (var i=0; i<childNodes.length; i++) {
                var node = childNodes[i];
                jo.children[i] = this.nodeToJSON(node);
                
                if (node.hasChildNodes())
                this.treeToJSON(node, jo.children[i]);
            }
        }
    },
    
     nodeToJSON: function(node) {

        var jn = {};
        jn.leaf = node.get('leaf');

        var text = node.get('text');
        if(text !== undefined && text !== null && text !== '')
        jn.text = text;

        var configuration = node.get('configuration');
        if(!Ext.isEmpty(configuration)){
            var cn = {};
            cn.module_root = configuration.module_root;
            cn.module_xtype = configuration.module_xtype;
            cn.module_import_xtype = configuration.module_import_xtype;
            cn.module_class = configuration.module_class;
            cn.module_instance_id = configuration.module_instance_id;
            jn.configuration = cn;
            
        }

        var properties = node.get('properties');
        if(properties !== undefined && properties !== null && properties !== ''){
            jn.properties = {};
            for (var i = 0; i < properties.length; i++) {
                if(!Ext.isEmpty(properties[i].Value) && !isNaN(properties[i].Value)){
                

                if (properties[i].Value % 1 != 0 || properties[i].Type == "String") {
                
                    jn.properties[properties[i].Property] = properties[i].Value;
                    
                }
                else {
                    
                    jn.properties[properties[i].Property] = parseInt(properties[i].Value);
                
                }

                }
                else{
                jn.properties[properties[i].Property] = properties[i].Value;
                }
            }
        }
              
        
        //NEEDED PROPERTIES AS ARRAY NOT AS OBJECT
        var arrproperties = node.get('properties');
        if(arrproperties !== undefined && arrproperties !== null && arrproperties !== ''){
            jn.arrproperties = [];
            for (var i = 0; i < arrproperties.length; i++) {
                if(!Ext.isEmpty(arrproperties[i].Value) && !isNaN(arrproperties[i].Value)){
                
                if (arrproperties[i].Value % 1 != 0 || arrproperties[i].Type == "String") {                
                    jn.arrproperties[i] = arrproperties[i].Value;                    
                }
                else {
                    
                    jn.arrproperties[i] = parseInt(arrproperties[i].Value);                
                }

                }
                else{
                jn.arrproperties[i] = arrproperties[i].Value;
                }
         }
        }
            
        
        //NEEDED PRIVATE PROPERTIES AS ARRAY NOT AS OBJECT
        var private_properties = node.get('private_properties');
        if(private_properties !== undefined && properties !== null && properties !== ''){
            jn.private_properties = [];
            for (var i = 0; i < private_properties.length; i++) {
                if(!Ext.isEmpty(private_properties[i].Value) && !isNaN(private_properties[i].Value)){
                
                if (private_properties[i].Value % 1 != 0 || private_properties[i].Type == "String") {                
                    jn.private_properties[i] = private_properties[i].Value;                    
                }
                else {
                    
                    jn.private_properties[i] = parseInt(private_properties[i].Value);                
                }

                }
                else{
                    jn.private_properties[i] = private_properties[i].Value;
                }
            }
        }               
        
        return jn;
    }

});
