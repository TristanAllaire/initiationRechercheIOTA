package initiationRechecheIOTA;

import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

import org.iota.jota.IotaAPI;
import org.iota.jota.dto.response.GetNodeInfoResponse;

public class Launcher {

	//Default seeds for testing
	public static String SEED1 = "RUMCMOIVAHHWJYS9ECAJDHNPCTS9NJXFPR9KUFWODAGQX9BRBXWGRZZCZSMMEXBEEGMUNKZKVOMMOISEG";
	public static String SEED2 = "OMNYQITDILYIJIXB9LFGJJMMUIXHU9XDZGUXGLXLYDFILSQYYAOTECZOCXKKUNENPKSKXMZQOSHTBWNSM";
	public static String SEED3 = "HBDWRDCF9ROMWGUN9VVKHUFJAGWZQJPMJZHDQFXWTTRTTWUBKIUODJI9OTOIDXKQRAMBYZQMISVEVSEWB";

	public static void main(String[] args) {
		//Se Connecte au Node IOTA
		IotaAPI api = new IotaAPI.Builder()
		        .protocol("https")
		        .host("nodes.devnet.thetangle.org")
		        .port(443)
		        .build();
		GetNodeInfoResponse response = api.getNodeInfo();
		
		System.out.println(ConsoleColors.GREEN+"\n------INFORMATION DU NODE IOTA------"+ConsoleColors.WHITE);
		System.out.println(ConsoleColors.YELLOW+response.toString());
				
		
		System.out.println("\nINITIALISATION DES ENTITES...");
		System.out.println("0%");
		//Création d'entité bidon
		Module voiture = new Module(api,"Voiture",SEED1,50,0);
		System.out.println("33%");
		Module feu = new Module(api,"Feu",SEED2,90,1);
		System.out.println("66%");
		Module parking = new Module(api,"Parking",SEED3,90,2);
		System.out.println("100%");
		System.out.println("\nENTITES INITIALISEES !");

		ArrayList<Module> entities = new ArrayList<Module>();
		
		entities.add(voiture);
		entities.add(feu);
		entities.add(parking);
		
		//Lancement de l'appli
		Scanner userInput = new Scanner(System.in);
		System.out.println(ConsoleColors.GREEN+"\n------MENU DE L'APPLICATION------"+ConsoleColors.WHITE);
		System.out.println("\nActions possibles :\n"+
        "1 - Afficher les informations d'une entité\n"+
        "2 - Afficher les détails du compte IOTA d'une entité\n"+
        "3 - Afficher le montant du portefeuille IOTA d'une entité\n"+
        "4 - Lancer un scénario\n"+
        "0 - Quitter le programme\n");
		System.out.println("\nQue voulez-vous faire ?");
		
		int choice = userInput.nextInt();
		while(choice!=0) {
			switch(choice){
				case 0:
					System.exit(0);
					break;
				case 1:
					displayEntities(entities);
					System.out.println("\nQuelle entité voulez-vous étudier ?");
					int entityChosen = userInput.nextInt();
	
					System.out.println(ConsoleColors.GREEN+"\n---Informations du module---\n"+ConsoleColors.YELLOW+entities.get(entityChosen).toString());
					break;
				case 2:
					displayEntities(entities);
					System.out.println("\nQuelle entité voulez-vous étudier ?");
					int entityChosenIOTA = userInput.nextInt();
					System.out.println(ConsoleColors.GREEN+"\n---Informations du module IOTA---\n"+ConsoleColors.YELLOW+entities.get(entityChosenIOTA).getIOTAInfo());
					break;
				case 3:
					displayEntities(entities);
					System.out.println("\nQuelle entité voulez-vous étudier ?");
					int entityChosenBalance = userInput.nextInt();
					System.out.println(ConsoleColors.GREEN+"\n---Portefeuille du module---\n"+ConsoleColors.YELLOW);
					entities.get(entityChosenBalance).printBalance();
					break;
				case 4:
					displayCars(entities);
					System.out.println("\nQuelle voiture voulez-vous choisir ?");
					int carChosen = userInput.nextInt();
					System.out.println("\nQuelle sera la durée du scénario ?");
					int scenarLength = userInput.nextInt();
					
					int[] scenarPattern = generateScenario(scenarLength);
					
					Scenario scenar = new Scenario(scenarPattern,entities,entities.get(carChosen),userInput);
					scenar.startScenario();
					break;
				default:
					break;
			}
			System.out.println(ConsoleColors.GREEN+"\n------MENU DE L'APPLICATION------"+ConsoleColors.WHITE);
			System.out.println("\nActions possibles :\n"+
	        "1 - Afficher les informations d'une entité\n"+
	        "2 - Afficher les détails du compte IOTA d'une entité\n"+
	        "3 - Afficher le montant du portefeuille IOTA d'une entité\n"+
	        "4 - Lancer un scénario\n"+
	        "0 - Quitter le programme\n");
			System.out.println("\nQue voulez-vous faire ?");
			choice = userInput.nextInt();
		}
		userInput.close();
	}
	
	private static int[] generateScenario(int scenarLength) {
		int[] scenarPattern = new int[scenarLength];
		Random r = new Random();
		for(int i=0; i<scenarPattern.length; i++) {
			scenarPattern[i] = r.nextInt(3);
		}
		return scenarPattern;
	}

	public static void displayEntities(ArrayList<Module> entities){
		int counter = 0;
		for(Module entity : entities) {
			System.out.println(counter+" - "+entity.getNom());
			counter++;
		}
	}
	
	public static void displayCars(ArrayList<Module> entities){
		int counter = 0;
		for(Module entity : entities) {
			if(entity.getType()==0) {
				System.out.println(counter+" - "+entity.getNom());
			}
			counter++;
		}
	}

}
