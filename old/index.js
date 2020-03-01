const fs = require('fs');
const readline = require('readline');
const Iota = require('@iota/core');
const colors = require('colors');

let entitiesData = fs.readFileSync("entities.json");
let entities = JSON.parse(entitiesData);
let mouvement = false;
let pause = false;

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
                rl.question("Quelle voiture voulez-vous choisir ?\n", (entity)=>{
                    if(entities[parseInt(entity)].type!="voiture"){
                        console.log("L'entité choisie n'est pas une voiture")
                    }
                    else {
                        rl.close()
                        lancementScenario(entities[parseInt(entity)])
                    }
                })
                break;
            case "test":
                console.log("first")
                console.log("dos")
                console.log("trois")
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

var sleep = function (delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

//------SCENARIO------
var lancementScenario = function(voitureChoisie){
    let voiture = voitureChoisie
    
    //Test de la rencontre avec un feu
    let leFeu
    entities.forEach((element)=>{
        if(element.type = "feu") leFeu = element
    })

    //Test de la rencontre avec un parking
    let leParking
    entities.forEach((element)=>{
        if(element.type = "parking") leParking = element
    })

    //Test
    voiture.options.charge = 50.00
    let rl = readline.createInterface({
        input : process.stdin,
        output : process.stdout
    })
    rl.question("Pour combien d'actions voulez-vous lancer la simulation ?", (time)=>{
        let counter = 0;
        let choice = Math.floor(Math.random() * Math.floor(3));
        choice = 1
        switch(choice){
            case 0:
                avancer(voiture);
                break;
            case 1:
                rencontrerFeu(voiture,leFeu);
                break;
            case 2:
                seGarerAuParking(voiture,leParking);
                break;
            case 3:
                seGarerAuGarage(voiture);
                break;
            default:
                break;
        }
        sleep(1000);

        if(!pause){
            rl.close()
        }
    })
}

//------ACTIONS POSSIBLES POUR LES VOITURES------
var avancer = function(voiture){
    console.log(colors.cyan("🚗 : LA VOITURE AVANCE"));
    mouvement = true;
    voiture.options.charge -= 0.01
}
var rencontrerFeu = function(voiture,feu){
    pause = true;
    console.log(colors.cyan("🚦 : LA VOITURE RENCONTRE UN FEU"))
    let dureeFeu = 500
    mouvement = false;
    //setTimeout(avancer,15000);
    let chargementActuel = voiture.options.charge
    console.log(colors.green("🔋 : LA VOITURE EST CHARGEE : "+chargementActuel+"%"))
    if(chargementActuel<100.00){
        demandeChargement(feu,voiture,dureeFeu)
    }
    sleep(3000);
    pause = false;
}
var seGarerAuParking = function(voiture, parking){
    console.log(colors.cyan("🅿️ : LA VOITURE RENCONTRE UN PARKING"))
    let rl = readline.createInterface({
        input : process.stdin,
        output : process.stdout
    })
    rl.question("Voulez-vous vous garer à cette place (se garer occasionne des frais) (Y/N)", (garer)=>{
        if(garer=="Y"){
            //rl.close()
            rl.question("Pour combien de temps ? (en ms)", (temps)=>{
                console.log(colors.yellow("---Paiement de la place de parking---"))
                sleep(1000);
                payerParking(voiture);
                let chargementActuel = voiture.options.charge
                console.log(colors.green("CHARGE DE "+voiture.options.name+" : "+chargementActuel+"%"))
                if(chargementActuel<100.00){
                    demandeChargement(parking,voiture,temps)
                }
                rl.close()
            })
        }
    })
}
var seGarerAuGarage = function(voiture){
    console.log(colors.cyan("🏡 : LA VOITURE RENTRE A LA MAISON"))
    console.log("Chargement du véhicule...")
    sleep(1000);
    while(voiture.options.charge!=100.00){
        voiture.options.charge += 0.01;
        console.log(colors.blue("\nVOITURE : "+voiture.options.charge))
        sleep(10)
    }
    console.log("Véhicule chargé à 100%, l'énergie supplémentaire sera fournie à la ville")
    sleep(1000);
}

//------DEMANDE CHARGEMENT------
var demandeChargement = function(sender,receiver,duree){
    let rl = readline.createInterface({
        input : process.stdin,
        output : process.stdout
    })
    rl.question("Voulez-vous dépenser de l'argent pour recharger votre voiture ? (Y/N)", (charge)=>{
        if(charge=="Y"){
            //actual code
            console.log(colors.yellow("---Début du transfert de charge---"))
            sleep(1000);
            for(i=0; i<duree; i++){
                console.log(colors.blue("\n"+receiver.options.name.toUpperCase()+" : "+receiver.options.charge))
                console.log(colors.red("\n"+sender.options.name.toUpperCase()+" : "+sender.options.charge))
                chargerVoiture(receiver,sender);
                sleep(10)
                i++
            }
            console.log(colors.yellow("---Charge terminée---"))
        }
        rl.close()
    })
}

//------INTERACTIONS AVEC IOTA------
var chargerVoiture = function(receiver,sender){
    let senderCharge = sender.options.charge;
    let receiverCharge = receiver.options.charge;
    if(receiverCharge<100.00 && senderCharge>0.00){
        receiver.options.charge += 0.01;
        sender.options.charge -= 0.01;
    }
}
var payerParking = function(voiture){
    return null;
}

//------CONNEXION AVEC UN DEVNET IOTA------
// Create a new instance of the IOTA API object
// Use the `provider` field to specify which node to connect to
console.log(colors.green("------DEMARRAGE DE LA CONNEXION AVEC UN DEVNET DE IOTA------"))
global.iota = Iota.composeAPI({
    provider: 'https://nodes.devnet.thetangle.org:443'
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
