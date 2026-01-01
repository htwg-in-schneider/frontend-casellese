/**
 * Recipe Model
 * Entspricht dem Backend: de.htwg.in.wete.backend.model.Recipe
 */
export class Recipe {
    constructor({
        id = null,
        productId = null,
        title = '',
        text = '',
        pdfUrl = null
    } = {}) {
        this.id = id;
        this.productId = productId;
        this.title = title;
        this.text = text;
        this.pdfUrl = pdfUrl;
    }

    /**
     * Erstellt ein Recipe aus einem API-Response Object
     */
    static fromJson(json) {
        return new Recipe({
            id: json.id,
            productId: json.productId,
            title: json.title,
            text: json.text,
            pdfUrl: json.pdfUrl
        });
    }

    /**
     * Konvertiert das Recipe zu einem JSON-Object für API-Requests
     */
    toJson() {
        return {
            id: this.id,
            title: this.title,
            text: this.text,
            pdfUrl: this.pdfUrl
        };
    }

    /**
     * Prüft ob ein PDF verfügbar ist
     */
    hasPdf() {
        return this.pdfUrl !== null && this.pdfUrl !== '';
    }
}

export default Recipe;
