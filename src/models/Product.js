/**
 * Product Model
 * Entspricht dem Backend: de.htwg.in.wete.backend.model.Product
 */
export class Product {
    constructor({
        id = null,
        title = '',
        description = '',
        category = null,
        price = 0,
        imageUrl = '',
        imageUrlDetails = '',
        ingredients = '',
        recipes = []
    } = {}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.imageUrl = imageUrl;
        this.imageUrlDetails = imageUrlDetails;
        this.ingredients = ingredients;
        this.recipes = recipes;
    }

    /**
     * Erstellt ein Product aus einem API-Response Object
     */
    static fromJson(json) {
        return new Product({
            id: json.id,
            title: json.title,
            description: json.description,
            category: json.category,
            price: json.price,
            imageUrl: json.imageUrl,
            imageUrlDetails: json.imageUrlDetails,
            ingredients: json.ingredients,
            recipes: json.recipes || []
        });
    }

    /**
     * Konvertiert das Product zu einem JSON-Object für API-Requests
     */
    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            category: this.category,
            price: this.price,
            imageUrl: this.imageUrl,
            imageUrlDetails: this.imageUrlDetails,
            ingredients: this.ingredients
        };
    }
}

export default Product;
