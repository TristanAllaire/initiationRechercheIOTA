// Dépendances
const fs = require('fs');
const crypto = require('crypto');
global.atob = require("atob");
global.btoa = require("btoa");

// Récupère la seed pour la création d'un compte
let argtype = process.argv[2];
let argname = process.argv[3];

// Vérification de bonne génération

console.log(process.argv)

if(argtype==null || argname==null){
    console.log("Au moins un des arguments n'a pas été renseigné.");
}
else if(argtype!="voiture" && argtype!="parking" && argtype!="garage" && argtype!="feu") {
    console.log("Le type indiqué n'est pas correct.");
}
else {

    // Génération d'un nouveau SEED
    var length       = 81;                            // The length of the seed and int array.
    var chars        = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9"; // The allowed characters in the seed.
    var randomValues = new Uint32Array(length);       // An empty array to store the random values.
    var result       = new Array(length);             // An empty array to store the seed characters.
    randomValues = crypto.randomBytes(length)
    var cursor = 0;                                   // A cursor is introduced to remove modulus bias.
    for (var i = 0; i < randomValues.length; i++) {   // Loop through each of the 81 random values.
            cursor += randomValues[i];                    // Add them to the cursor.
            result[i] = chars[cursor % chars.length];     // Assign a new character to the seed based on cursor mod 81.
        }
    let iotaSeed = result.join('');                           // Merge the array into a single string and return it.

    // Création de la nouvelle entité
    let object = {
        timestamp: new Date().getTime(),
        name: argname,
        type: argtype,
        seed: iotaSeed,
        options: null
    }
    let jsonObject = JSON.stringify(object)
    console.log(jsonObject);
    console.log(btoa(jsonObject));

    // Récupération des entités existantes
    let entitiesFile = fs.readFileSync("entities.json");
    let entities = JSON.parse(entitiesFile);
    entities.push(object)

    fs.writeFileSync("entities.json",JSON.stringify(entities))

    console.log("Entité créée.")
}