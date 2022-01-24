import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";
import { Reimbursement } from "../entities";
import { ReimbursementError } from "../Error/error";



const client = new CosmosClient(process.env.COSMOS_CONNECTION);
const database = client.database('rpas-db');
const container = database.container('Reimbursements');

export interface ReimbursementDao {
    createReimbursement(Reimbursement: Reimbursement): Promise<Reimbursement>;

    getReimbursements(accountId: string, managerControl: boolean): Promise<Reimbursement[]>;

    getReimbursementByID(id: string): Promise<Reimbursement>;

    updateStatusReimbursement(reimbursement: Reimbursement): Promise<Reimbursement>;
}

export default class ReimbursementDaoImpl implements ReimbursementDao {
    async createReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
        reimbursement.id = v4();
        const response = await container.items.create(reimbursement);
        return response.resource;
    }

    async getReimbursements(accountId: string, managerControl: boolean): Promise<Reimbursement[]> {
        let query;
        let response;
        if (accountId == '') {
            response = await container.items.query("SELECT * from A ORDER BY A.account.id").fetchAll();
        }
        else if (accountId != '') {
            if (managerControl) {
                query = "SELECT * from A WHERE A.account.id != @aid ORDER BY A.account.id";
            }
            else {
                query = "SELECT * from A WHERE A.account.id = @aid"
            }
            response = await container.items.query({
                query,
                parameters: [{ name: "@aid", value: accountId }]
            }).fetchAll();
        }
        return response.resources;
    }

    async getReimbursementByID(id: string): Promise<Reimbursement> {
        const response = await container.item(id, id).read<Reimbursement>();

        const reimbursement: Reimbursement = response.resource;
        return reimbursement;
    }

    async updateStatusReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
        const reimburse: Reimbursement = await this.getReimbursementByID(reimbursement.id);
        if (!reimburse) {
            throw new Error("ReimbursementService passed the wrong reimbursement, no such reimbursement exists to be updated");
        }
        const response = await container.items.upsert<Reimbursement>(reimbursement);
        return response.resource;
    }
}

