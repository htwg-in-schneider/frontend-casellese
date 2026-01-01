export const products = [
    {
        id: 1,
        title: "Caciocavallo",
        description:
            "Caciocavallo ist ein italienischer Kult-Käse mit unverwechselbarer birnenförmiger Gestalt, der traditionell paarweise an der Schnur hängt",
        category: "KAESE",
        price: 7.99,
        imageUrl: "http://nucccio.github.io/casellese-images/caciocavallo.webp",
        imageUrlDetails:
            "http://nucccio.github.io/casellese-images/caciocavallo-rezepte.webp",
        ingredients: 
            "Kuhmilch, Lab, Salz, Konservierungsstoff: Natriumbenzoat (E211)",
    },
    {
        id: 2,
        title: "Salsiccia",
        description:
            "Salsiccia ist eine traditionelle italienische Wurst aus fein gewürztem Schweinefleisch, oft mit Knoblauch, Fenchel oder Chili verfeinert.",
        category: "SALAMI",
        price: 15.99,
        imageUrl:
            "http://nucccio.github.io/casellese-images/salsiccia.webp",
        imageUrlDetails:
            "http://nucccio.github.io/casellese-images/salsiccia-rezepte.webp",
        ingredients:
            "Schweinefleisch, Salz, Knoblauch, Fenchelsamen, Paprika, schwarzer Pfeffer",
    },
    {
        id: 3,
        title: "Brot",
        description:
            "Brot ist das zeitlose Grundnahrungsmittel, frisch gebacken mit knuspriger Kruste und weichem Inneren.",
        category: "BROT",
        price: 4.99,
        imageUrl:
            "http://nucccio.github.io/casellese-images/brot.webp",
        imageUrlDetails:
            "http://nucccio.github.io/casellese-images/brot-rezepte.webp",
        ingredients:
            "Weizenmehl, Wasser, Hefe, Salz, Olivenöl",
    },
];

export const recipes = [
    {
        id: 1,
        productId: 1,
        title: "Überbackene Caciocavallo-Scheiben",
        text: `## Zutaten
- 200g Caciocavallo
- 2 EL Olivenöl
- Frischer Oregano
- 1 Knoblauchzehe

## Zubereitung
1. Käse in ca. 1cm dicke Scheiben schneiden
2. Olivenöl in einer Pfanne erhitzen
3. Käsescheiben von beiden Seiten goldbraun braten (ca. 2 Min. pro Seite)
4. Mit gehacktem Knoblauch und Oregano bestreuen
5. Sofort servieren, solange der Käse noch warm und cremig ist

## Tipp
Dazu passt frisches Brot und ein Glas Rotwein!`,
        pdfUrl: null,
    },
    {
        id: 2,
        productId: 2,
        title: "Pasta mit Salsiccia",
        text: `## Zutaten
- 400g Pasta (Rigatoni oder Penne)
- 300g Salsiccia
- 400g passierte Tomaten
- 1 Zwiebel
- 2 Knoblauchzehen
- Frischer Basilikum
- Parmesan

## Zubereitung
1. Salsiccia aus der Haut drücken und in kleine Stücke zerteilen
2. Zwiebel und Knoblauch fein hacken
3. In Olivenöl die Salsiccia anbraten bis sie goldbraun ist
4. Zwiebel und Knoblauch hinzufügen und glasig dünsten
5. Passierte Tomaten hinzufügen und 15 Min. köcheln lassen
6. Pasta al dente kochen und mit der Sauce vermischen
7. Mit Parmesan und frischem Basilikum servieren`,
        pdfUrl: null,
    },
    {
        id: 3,
        productId: 3,
        title: "Bruschetta Classica",
        text: `## Zutaten
- 4 Scheiben Brot
- 4 reife Tomaten
- 2 Knoblauchzehen
- Frischer Basilikum
- Olivenöl extra vergine
- Salz und Pfeffer

## Zubereitung
1. Brotscheiben im Ofen oder auf dem Grill rösten
2. Tomaten würfeln und mit gehacktem Basilikum, Salz und Olivenöl mischen
3. Geröstetes Brot mit einer halbierten Knoblauchzehe einreiben
4. Tomatenmischung großzügig auf das Brot geben
5. Mit einem Schuss Olivenöl beträufeln und sofort servieren`,
        pdfUrl: null,
    },
];

// Helper function to get recipes for a product
export function getRecipesByProductId(productId) {
    return recipes.filter(recipe => recipe.productId === productId);
}

// Helper function to get a single recipe by id
export function getRecipeById(recipeId) {
    return recipes.find(recipe => recipe.id === recipeId);
}

