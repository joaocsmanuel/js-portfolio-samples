//Calling Arcgis for javascript and dojo libraries
require([
	"esri/map", "esri/layers/FeatureLayer", 'esri/layers/WMSLayer', 'esri/layers/WMSLayerInfo',
	'esri/geometry/Extent',	'esri/SpatialReference', "dojo/_base/lang",	"esri/dijit/Search",
	"esri/dijit/Legend", "esri/dijit/Bookmarks", "esri/dijit/BookmarkItem", "esri/dijit/BasemapToggle",
	"esri/layers/FeatureLayer", "esri/toolbars/edit", "esri/toolbars/draw", "esri/dijit/editing/TemplatePicker",
	"dojo/_base/array", "dijit/form/DropDownButton", "dojo/parser", "dijit/form/TextBox",
	"dijit/TooltipDialog", "dijit/form/Button",	"esri/tasks/query", "esri/tasks/QueryTask",
	"esri/dijit/FeatureTable", "dijit/layout/ContentPane", "dijit/layout/BorderContainer", "dojo/on", "dojo/dom", "dojo/domReady!"
  	],
	function(
	Map, FeatureLayer, WMSLayer, WMSLayerInfo,
	Extent,	SpatialReference, lang,	Search,
	Legend, Bookmarks, BookmarkItem, BasemapToggle,
	FeatureLayer, Edit, Draw, TemplatePicker,
	arrayUtils, DropDownButton, parser, TextBox,
	TooltipDialog, Button, Query, QueryTask,
	FeatureTable, ContentPane, BorderContainer, on, dom
	) {
		parser.parse();
		var oMap, oFeatureLayer, oSearch, oBookmarksList, oBookmark, oToggle, oQuery, oQueryTask, oFeatureTable;

		init();

		function init(){
			//Declaring and calling basemap, in this case is the hybrid type (vector and image).
			oMap = new Map("map", {
				basemap: "streets",
				zoom: 10,
				center: [-98.25, 38.52]
			});

			oFeatureLayer = new FeatureLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/2",{
				mode: FeatureLayer.MODE_ONDEMAND,
				outFields:["*"]
			});

			oSearch = new Search({
				map: oMap,
				enableButtonMode: true
			}, "search");

			//--BOOKMARKS
			oBookmarksList = [{
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

			oBookmark = new Bookmarks({
				map: oMap,
				bookmarks: oBookmarksList
			}, 'bookmarks');

			//--BASEMAP TOGGLE
			oToggle = new BasemapToggle({
				map: oMap,
				basemap: "hybrid"
			}, "basemapToggle");
			oToggle.startup();

			on(dom.byId('legendButton'),"click", function(e){
				if(dom.byId('legendPane').style.display == 'inline')
					dom.byId('legendPane').style.display = 'none';
				else
					dom.byId('legendPane').style.display = 'inline';
			});

			oMap.on("layers-add-result", initContent);
			oMap.addLayers([oFeatureLayer]);
			createQuery();
			createFeatureTable();
  		};
  //--------------------------------------------------------------------------------

		function createQuery(){
			oQueryTask = new QueryTask("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/2");
			oQuery = new Query();
			oQuery.outSpatialReference = {"wkid": 102100};
			oQuery.returnGeometry = true;
			oQuery.outFields = ["*"];
			oSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.5]));
			on(oMap, "click", execute);
		};

		function execute(evt) {
			oMap.infoWindow.hide();
			oMap.graphics.clear();
			//onClick event returns the evt point where the user clicked on the map.
			//This is contains the mapPoint (esri.geometry.point) and the screenPoint (pixel xy where the user clicked).
			//set query geometry = to evt.mapPoint Geometry
			oQuery.geometry = evt.mapPoint;
			//Execute task and call showResults on completion
			oQueryTask.execute(oQuery,showFeature);
		};

		function showFeature(evt) {
			oMap.graphics.clear();
			var oFeature = evt.features[0];
			oFeature.setSymbol(oSymbol);
			oMap.graphics.add(oFeature);
			dom.byId('borderContainer').style.height = '30%';
			dom.byId('borderContainer').style.width = '100%';
			dom.byId('map').style.height = '70%';
			dom.byId('contentPane').style.margin = '4px';
			dom.byId('contentPane').style.height = '150px';

			oFeatureTable.filterRecordsByIds([oFeature.attributes.OBJECTID]);
		};

		function createFeatureTable(){
			//--FEATURE TABLE
			var oContentPane = document.querySelector("#contentPane");
			oContentPane.appendChild(createNode("div", {id: "myTable"}));
			// create new FeatureTable and set its properties
			oFeatureTable = new FeatureTable({
				featureLayer : oFeatureLayer,
				map : oMap,
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
			oFeatureTable.startup();
		};

		function createNode(name, attributes){
			var oNode = document.createElement(name);
			if(attributes){
				for(var attr in attributes)
					if (attributes.hasOwnProperty(attr))
						oNode.setAttribute(attr, attributes[attr]);
			}
			for (var i = 2; i < arguments.length; i++) {
				var oChild = arguments[i];
				if(typeof child == "string")
					oChild = document.createTextNode(oChild);
				oNode.appendChild(oChild);
			}
			return oNode;
		}

		function initContent(evt) {
			var oLayerInfo = arrayUtils.map(evt.layers, function (layer, index) {
				return {layer:layer.layer, title:layer.layer.name};
			});

		      	if (layerInfo.length > 0) {
				var oLegend = new Legend({
			  		map: oMap,
			  		layerInfos: oLayerInfo
				}, "legend");
				oLegend.startup();
		      	}
			var arrLayers = arrayUtils.map(evt.layers, function(result) {
				return result.layer;
			});
    		};
  	}
);
