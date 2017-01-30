//Calling Arcgis for javascript and dojo libraries
require([
  "esri/map", "esri/layers/FeatureLayer", 'esri/layers/WMSLayer', 'esri/layers/WMSLayerInfo',
	'esri/geometry/Extent',	'esri/SpatialReference', "dojo/_base/lang",	"esri/dijit/Search",
  "esri/dijit/Legend", "esri/dijit/Bookmarks", "esri/dijit/BookmarkItem", "esri/dijit/BasemapToggle",
	"esri/layers/FeatureLayer", "esri/toolbars/edit", "esri/toolbars/draw", "esri/dijit/editing/TemplatePicker",
	"dojo/_base/array", "dijit/form/DropDownButton", "dojo/parser", "dijit/form/TextBox",
  "dijit/TooltipDialog", "dijit/form/Button",	"esri/tasks/query", "esri/tasks/QueryTask",
  "esri/dijit/FeatureTable", "dijit/layout/ContentPane", "dijit/layout/BorderContainer",
	"dojo/on", "dojo/dom",
  "dojo/domReady!"
  ],
  function(
  Map, FeatureLayer, WMSLayer, WMSLayerInfo,
	Extent,	SpatialReference, lang,	Search,
  Legend, Bookmarks, BookmarkItem, BasemapToggle,
	FeatureLayer, Edit, Draw, TemplatePicker,
	arrayUtils, DropDownButton, parser, TextBox,
  TooltipDialog, Button,	Query, QueryTask,
  FeatureTable,	ContentPane, BorderContainer,
  on, dom
  ) {
	   parser.parse();
  //Declaring and calling basemap, in this case is the hybrid type (vector and image).
    var map = new Map("map", {
      basemap: "streets",
  	  zoom: 10,
  	  center: [-98.25, 38.52]
    });

  	var featureLayer = new FeatureLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/2",{
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields:["*"]
    });

    var search = new Search({
  		map: map,
  		enableButtonMode: true
  	}, "search");

    map.on("layers-add-result", initContent);
    map.addLayers([featureLayer]);

//--------------------------------------------------------------------------------
    //--QUERYING DATA
  	var queryTask = new QueryTask("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/2");
  	var query = new Query();
  	query.outSpatialReference = {"wkid": 102100};
  	query.returnGeometry = true;
  	query.outFields = ["*"];
    symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.5]));
    on(map, "click", execute);

  	function execute(evt) {
          map.infoWindow.hide();
          map.graphics.clear();
          //onClick event returns the evt point where the user clicked on the map.
          //This is contains the mapPoint (esri.geometry.point) and the screenPoint (pixel xy where the user clicked).
          //set query geometry = to evt.mapPoint Geometry
          query.geometry = evt.mapPoint;
          //Execute task and call showResults on completion
          queryTask.execute(query,showFeature);
  	}

  	function showFeature(evt) {
      map.graphics.clear();
  		var feature = evt.features[0];
      feature.setSymbol(symbol);
      map.graphics.add(feature);
  		dom.byId('borderContainer').style.height = '30%';
  		dom.byId('borderContainer').style.width = '100%';
  		dom.byId('map').style.height = '70%';
  		dom.byId('contentPane').style.margin = '4px';
  		dom.byId('contentPane').style.height = '150px';
  		myFeatureTable.filterRecordsByIds([feature.attributes.OBJECTID]);
  	}

    //--FEATURE TABLE
  	var contentPane = document.querySelector("#contentPane");
  	contentPane.appendChild(createNode("div", {id: "myTable"}));
  	// create new FeatureTable and set its properties
  	var myFeatureTable = new FeatureTable({
  		featureLayer : featureLayer,
  		map : map,
  		showAttachments: true,
  		// only allows selection from the table to the map
  		syncSelection: true,
  		zoomToSelection: true,
  		gridOptions: {
  		  allowSelectAll: true,
  		  allowTextSelection: true,
  		},
  		editable: false,
  		dateOptions: {
  		  // set date options at the feature table level
  		  // all date fields will adhere this
  		  datePattern: "MMMM d, y"
  		},
  		// define order of available fields. If the fields are not listed in 'outFields'
  		// then they will not be available when the table starts.
  		outFields: ["*"
  	]}, 'myTable');
    myFeatureTable.startup();

  	function createNode(name, attributes){
  		var node = document.createElement(name);
  		if(attributes){
  			for(var attr in attributes)
  				if (attributes.hasOwnProperty(attr))
  					node.setAttribute(attr, attributes[attr]);
  			}
  		for (var i = 2; i < arguments.length; i++) {
  			var child = arguments[i];
  			if(typeof child == "string")
  				child = document.createTextNode(child);
  			node.appendChild(child);
  		}
  		return node;
  	}

  	on(dom.byId('legendButton'),"click", function(e){
  		if(dom.byId('legendPane').style.display == 'inline')
        dom.byId('legendPane').style.display = 'none';
  		else
        dom.byId('legendPane').style.display = 'inline';
  	});

  	//--BOOKMARKS
  	var bookmarks_list = [{
  	"extent": {
  		"spatialReference": {
  			"wkid": 4326
  		},
  		"xmin":-74,
  		"ymin":40.707,
  		"xmax":-74.009,
  		"ymax":40.712
  		},
  	"name": "New York"
      }];

  	var bookmark = new Bookmarks({
  	    map: map,
  		bookmarks: bookmarks_list
  	}, 'bookmarks');

    //--BASEMAP TOGGLE
  	var toggle = new BasemapToggle({
          map: map,
          basemap: "hybrid"
      }, "basemapToggle");
    toggle.startup();

    //--EDITOR
  	function initContent(evt) {
  		var layerInfo = arrayUtils.map(evt.layers, function (layer, index) {
        return {layer:layer.layer, title:layer.layer.name};
      });

      if (layerInfo.length > 0) {
        var legend = new Legend({
          map: map,
          layerInfos: layerInfo
        }, "legend");
        legend.startup();
      }

  		var currentLayer = null;
  		var layers = arrayUtils.map(evt.layers, function(result) {
  			return result.layer;
		  });
    }
  });
