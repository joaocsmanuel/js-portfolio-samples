#Leaflet Buffer Map
Just small mapping app using JavaScript for ArcGIS, with US states census information (the layer can change)
Has several functionalities, like search address, bookmarks, content table, records table.

##Getting Started
No need for installing.


Just open app.html on a browser, press F12, and check the console for the results.
The output is set inside of the file starting on the line 64
var food = new Inventory("food", []);
food.addNewProduct(new Product(1, 7, 100));
food.addNewProduct(new Product(2, 10, 300));
food.addNewProduct(new Product(3, 5, 55));
food.updateQuantityProduct(1, 50, "remove");
food.removeProduct(2)

console.log(food.inventoryValue());


Constructors - Product e Inventory
Inventory methods - addNewProduct, updateQuantityProduct, updatePriceProduct, removeProduct, inventoryValue


##Built with
* JavaScript

##Versioning

##Authors
* **João Manuel**

##License

This project is licensed under the MIT License - see the LICENSE.md file for details
