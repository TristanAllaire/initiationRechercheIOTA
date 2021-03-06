package initiationRechecheIOTA;

import java.util.ArrayList;
import java.util.List;

import org.iota.jota.IotaAPI;
import org.iota.jota.builder.AddressRequest;
import org.iota.jota.dto.response.GetAccountDataResponse;
import org.iota.jota.dto.response.GetNewAddressResponse;
import org.iota.jota.dto.response.GetNodeInfoResponse;
import org.iota.jota.dto.response.SendTransferResponse;
import org.iota.jota.error.ArgumentException;
import org.iota.jota.model.Input;
import org.iota.jota.model.Transaction;
import org.iota.jota.model.Transfer;
import org.iota.jota.utils.TrytesConverter;

public class Module {

	public String nom = "";
	public String seed = "";
	public int charge = 0;
	public int surcharge = 0;
	public int type = 0;
	public IotaAPI api;
	public String publicAddress = "";
	public List<Input> inputs = null;
	
	public ArrayList<Transfer> transfers;
	
	public String logo = "";
	
	public Module(IotaAPI api, String nom, String seed, int charge, int type) {
		this.nom = nom;
		this.seed = seed;
		this.charge = charge;
		this.type = type;
		this.api = api;
		this.transfers = new ArrayList<Transfer>();
		
		switch(type) {
			case 0:
				logo = "🚗";
				break;
			case 1:
				logo = "🚦";
				break;
			case 2:
				logo = "🅿️";
				break;
			default:
				break;
		}
		
		this.publicAddress = this.getAccountData().getAddresses().get(0);
		this.inputs = this.getAccountData().getInput();
	}
	
	public String toString() {
		return "Nom : "+nom+"\nType : "+logo+"\nCharge : "+charge+"%"+"\nSeed : "+seed;
	}
	
	public String getIOTAInfo() {
		return getAccountData().toString();
	}
	
	public void payer(Module module, int prix) {
		System.out.println("Paiement...");
		String address = module.getPublicAddress();
		Transfer t = new Transfer(address,prix);
		System.out.println(ConsoleColors.CYAN+"Transaction " + t.toString()+ConsoleColors.WHITE);
		this.transfers.add(t);
	}
	
	public void charger(int charge) {
		if(this.charge<100) {
			this.charge+=charge;
		}
		else this.surcharge+=charge;
		System.out.println("Chargement par Panneau Solaire... "+this.logo+":"+this.charge+"% ➡ 🔋:"+this.surcharge+"%");
	}
	
	public void payerEnChargeant(Module module) {
		System.out.println("Chargement... "+this.logo+":"+this.charge+"% ➡ "+module.logo+":"+module.charge+"%");
		module.charge-=5;
		this.charge+=5;
		String address = module.getPublicAddress();
		//GetNewAddressResponse address = api.generateNewAddresses(new AddressRequest.Builder(module.seed, 2).amount(1).checksum(true).build());
		Transfer t = new Transfer(address,1);
		System.out.println(ConsoleColors.CYAN+"Transfer " + t.toString()+ConsoleColors.WHITE);
		this.transfers.add(t);
	}
	
	public void prepareTransfers() {
		this.transfers = new ArrayList<Transfer>();
	}
	
	public void sendTransfers() {
		try {
		    SendTransferResponse response = this.api.sendTransfer(this.seed, 2, 3, 9, this.transfers, this.inputs, null, false, false, null);
		    System.out.println(response.getTransactions());
		}
		catch(IllegalStateException e) {
			System.out.println("ERREUR : Le module "+this.nom+" ne possède pas un solde suffisant");
		}
		catch(ArgumentException e) {
			e.printStackTrace();
		}
	}
	
	public void vendreSurcharge(Module module) {
		this.surcharge-=5;
		module.charge+=5;
		System.out.println("Chargement... 🔋:"+this.surcharge+"% ➡ "+module.logo+":"+module.charge+"%");
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public int getCharge() {
		return charge;
	}

	public void setCharge(int charge) {
		this.charge = charge;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getSurcharge() {
		return surcharge;
	}

	public void setSurcharge(int surcharge) {
		this.surcharge = surcharge;
	}
	
	public ArrayList<Transfer> getTransfers() {
		return transfers;
	}

	public void setTransfers(ArrayList<Transfer> transfers) {
		this.transfers = transfers;
	}

	public GetAccountDataResponse getAccountData() {
		return api.getAccountData(this.seed, 2, 0,true,20,false,0,20,true,0);
	}
	
	public String getPublicAddress() {
		return publicAddress;
	}

	public void setPublicAddress(String publicAddress) {
		this.publicAddress = publicAddress;
	}

	public void printBalance() {
		long balance = getAccountData().getBalance();
		System.out.println(this.logo+" : "+balance+"i");
	}
	
	public long getBalance() {
		return this.api.getBalance(100, this.publicAddress);
	}
}
