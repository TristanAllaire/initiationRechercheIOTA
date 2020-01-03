const fs = require('fs');
const readline = require('readline');
const Iota = require('@iota/core');
const colors = require('colors');

let entitiesData = fs.readFileSync("entities.json");
let entities = JSON.parse(entitiesData)

//------FONCTION UTILISEE DANS LE POC------
var userActionChoice = function(){
    console.log(colors.green("\n------MENU DE L'APPLICATION------"))
    // Affichage des entités déjà créée
    console.log("Entités récupérées dans le fichier :");
    let objectIndex = 0;
    entities.forEach((element) => {
        let entity = objectIndex.toString()+" - "+element.name+" : "+element.type; 
        switch(element.type){
            case "voiture":
                console.log(colors.bgMagenta(entity))
                break;
            case "feu":
                console.log(colors.bgRed(entity))
                break;
            case "garage":
                console.log(colors.bgBlue(entity))
                break;
            case "parking":
                console.log(colors.bgGreen(entity))
                break;
            default:
                break;
        };
        objectIndex++
    })

    console.log("\nActions possibles :\n",
        "0 - Afficher les informations d'une entité\n",
        "1 - Afficher les détails du compte IOTA d'une entité\n",
        "2 - Pourvoir une entité en iota\n",
        "3 - Lancer un scénario\n",
        "exit - Quitter le programme\n");

    const rl = readline.createInterface({
        input : process.stdin,
        output : process.stdout
    })
    rl.question("Que voulez-vous faire ?\n", (rep)=>{
        switch(rep){
            case "0":
                rl.question("Quelle entité voulez-vous étudier ?\n", (entity)=>{
                    console.log(colors.yellow("\n---INFORMATIONS DE L'ENTITE---"))
                    console.log(entities[parseInt(entity)])
                    
                    // Demande d'un input pour réafficher le menu
                    rl.question("\nAppuyez sur une touche", (next)=>{
                        rl.close()
                        userActionChoice()
                    })
                })
                break;
            case "1":
                rl.question("Quelle entité voulez-vous étudier ?\n", (entity)=>{
                    console.log(colors.yellow("\n---DETAILS DU COMPTE DE L'ENTITE---"))
                    console.log(accountDataIOTA(entities[parseInt(entity)].seed))
                    
                    // Demande d'un input pour réafficher le menu
                    rl.question("\nAppuyez sur une touche", (next)=>{
                        rl.close()
                        userActionChoice()
                    })
                })
                break;
            case "2":
                rl.question("Quelle entité voulez-vous approvisionner en iota ?\n", (entity)=>{
                    console.log(colors.yellow("\n---BALANCE ACTUELLE DE L'ENTITE---"))
                    console.log(displayAccountBalance(entities[parseInt(entity)].seed))
                    
                    // Demande d'un input pour réafficher le menu
                    rl.question("\nAppuyez sur une touche", (next)=>{
                        rl.close()
                        userActionChoice()
                    })
                })
                break;
            case "3":
                displayEntityInfo(entities[0]);
                break;
            case "exit":
                rl.close();
                break;
            default:
                userActionChoice()
                break;
        }
    })
}

var accountDataIOTA = function(seed){
    return iota.getAccountData(seed, {
        start: 0,
        security: 2
    })
        .then(accountData => {
            const { addresses, inputs, transactions, balance } = accountData
            console.log(accountData)
        })
        .catch(err => {
            throw err
        })
}

var displayAccountBalance = function(seed){
    iota.getAccountData(seed, {
        start: 0,
        security: 2
    })
        .then(accountData => {
            const { addresses, inputs, transactions, balance } = accountData
            console.log(balance)
        })
        .catch(err => {
            throw err
        })
}

var displayEntityInfo = function(entity){
    iota.getAccountData(entity.seed, {
        start: 0,
        security: 2
    })
        .then(accountData => {
            const { addresses, inputs, transactions, balance } = accountData
            console.log(colors.bgWhite(colors.black("\n---"+entity.name.toUpperCase()+"---")))
            console.log(colors.bgWhite(colors.black("Type de l'entité: "+entity.type.toUpperCase()+
            "\nMontant du portefeuille de l'entité: "+balance+" iota")));
        })
        .catch(err => {
            throw err
        })    
}

//------CONNEXION AVEC UN DEVNET IOTA------
// Create a new instance of the IOTA API object
// Use the `provider` field to specify which node to connect to
console.log(colors.green("------DEMARRAGE DE LA CONNEXION AVEC UN DEVNET DE IOTA------"))
global.iota = Iota.composeAPI({
    provider: 'https://nodes.devnet.iota.org:443'
    });
    
    // Call the `getNodeInfo()` method for information about the node and the Tangle
    iota.getNodeInfo()
    // Convert the returned object to JSON to make the output more readable
    .then(info => {
        console.log(JSON.stringify(info, null, 1))
        userActionChoice();
    })
    .catch(err => {
        // Catch any errors
        console.log(err);
    });
