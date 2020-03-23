package initiationRechecheIOTA;

import java.util.ArrayList;
import java.util.Date;
import java.util.Random;
import java.util.Scanner;

public class Scenario {
	public int[] scenarPattern;
	public ArrayList<Module> entities,feux,parkings;
	public Module voiture;
	public Scanner userInput;
	
	private final int ACTION_WAIT = 2000;
	
	public Scenario(int[] scenarPattern, ArrayList<Module> entities, Module voiture, Scanner userInput) {
		this.scenarPattern = scenarPattern;
		this.entities = entities;
		this.voiture = voiture;
		this.userInput = userInput;
		
		this.feux = new ArrayList<Module>();
		this.parkings = new ArrayList<Module>();
		for(Module entity : entities) {
			if(entity.getType()==1) {
				feux.add(entity);
			}
			else if(entity.getType()==2) {
				parkings.add(entity);
			}
		}
	}

	public void startScenario() {
		partirDeChezSoi();
		for(int i=0; i<scenarPattern.length; i++) {
			avancer();
			switch(scenarPattern[i]) {
				case 1:
					rencontrerFeu();
					break;
				case 2:
					seGarerAuParking();
					break;
				default:
					break;
			}
		}
		rentrerChezSoi();
	}
	
	private void avancer(){
		System.out.println("🚗 : LA VOITURE AVANCE");
		this.voiture.setCharge(this.voiture.getCharge()-5);
		System.out.println(ConsoleColors.YELLOW+"{\n"+this.voiture.toString()+"\n}"+ConsoleColors.WHITE);
		wait(ACTION_WAIT);
	}
	
	private void rencontrerFeu() {
		System.out.println("🚦 : LA VOITURE RENCONTRE UN FEU");
		Random random = new Random();
		Module leFeu = this.feux.get(random.nextInt(this.feux.size()));
		System.out.println(ConsoleColors.YELLOW+"{\n"+leFeu.toString()+"\n}"+ConsoleColors.WHITE);
		System.out.println("En patientant au feu, voulez-vous dépenser de l'argent pour recharger votre voiture ? (Y/N)");
		char payerFeu = this.userInput.next().charAt(0);
		if(payerFeu == 'Y') {
			this.voiture.prepareTransfers();
			for(int i=0; i<4; i++) {
				this.voiture.payerEnChargeant(leFeu);
				wait(ACTION_WAIT/4);
			}
			this.voiture.sendTransfers();
			System.out.println("Les Transactions sont envoyées pour validation");
		}
		wait(ACTION_WAIT);	
	}
	
	private void seGarerAuParking() {
		System.out.println("🅿️ : LA VOITURE RENCONTRE UN PARKING");
		Random random = new Random();
		Module leParking = this.parkings.get(random.nextInt(this.parkings.size()));
		System.out.println(ConsoleColors.YELLOW+"{\n"+leParking.toString()+"\n}"+ConsoleColors.WHITE);
		System.out.println("Voulez-vous payer pour vous garer sur cette place de parking ? (Y/N)");
		char garerVoiture = this.userInput.next().charAt(0);
		if(garerVoiture == 'Y') {
			this.voiture.prepareTransfers();
			this.voiture.payer(leParking,1);
			wait(ACTION_WAIT);
			System.out.println("En vous garant, voulez-vous dépenser de l'argent supplémentaire pour recharger votre voiture ? (Y/N)");
			garerVoiture = this.userInput.next().charAt(0);
			if(garerVoiture=='Y') {
				for(int i=0; i<4; i++) {
					this.voiture.payerEnChargeant(leParking);
					wait(ACTION_WAIT/4);
				}
			}
			this.voiture.sendTransfers();
			System.out.println("Les Transactions sont envoyées pour validation");
		}
		wait(ACTION_WAIT);
	}
	
	private void partirDeChezSoi() {
		System.out.println("🏡 : LA VOITURE PART DE CHEZ ELLE");
		wait(ACTION_WAIT);
	}
	
	private void rentrerChezSoi() {
		System.out.println("🏡 : LA VOITURE RENTRE CHEZ ELLE");
		for(int i=0; i<15; i++) {
			this.voiture.charger(5);
			wait(ACTION_WAIT/4);
		}
		System.out.println("Votre voiture est complétement chargée, voulez-vous approvisionner le quartier avec le surplus ? (Y/N)");
		char chargerVille = this.userInput.next().charAt(0);
		if(chargerVille=='Y') {
			this.voiture.prepareTransfers();
			for(Module entity : this.entities) {
				entity.prepareTransfers();
			}
			Module leModule = randomModule(this.entities);
			boolean needCharge = moduleNeedCharge(this.entities);
			while(this.voiture.getSurcharge()>0 && needCharge) {
				this.voiture.vendreSurcharge(leModule);
				leModule.payerEnChargeant(this.voiture);
				needCharge = moduleNeedCharge(this.entities);
				leModule = randomModule(this.entities);
				wait(ACTION_WAIT/4);
			}
			for(Module entity : this.entities) {
				if(entity.getTransfers().size()>0) {
					entity.sendTransfers();
				}
			}
		}
		wait(ACTION_WAIT);
	}
	
	private void wait(int ms) {
		try {
			Thread.sleep(ms);
		}catch(InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	private Module randomModule(ArrayList<Module> modules) {
		Random random = new Random();
		Module leModule = this.entities.get(random.nextInt(this.entities.size()));
		while(leModule.getType()==0 || leModule.getCharge()>100) {
			random = new Random();
			leModule = this.entities.get(random.nextInt(this.entities.size()));
		}	
		return leModule;
	}
	
	private boolean moduleNeedCharge(ArrayList<Module> modules) {
		boolean need = false;
		for(Module entity : entities) {
			if(entity.getType()!=0 && entity.getCharge()<100) {
				need = true;
				break;
			}else continue;
		}
		return need;
	}
}
