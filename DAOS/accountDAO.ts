import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";
import { Account } from "../entities";



const client = new CosmosClient(process.env.COSMOS_CONNECTION);
const database = client.database('rpas-db');
const container = database.container('Account');


export interface AccountDao {
    getAccountByUsername(username: string): Promise<Account>;
    createAccount(account: Account): Promise<Account>;
    checkAccountById(id: string): Promise<boolean>;
    getAccountById(ID: string): Promise<{ fname: string, lname: string, id: string }>;
}

export class AccountDaoImpl implements AccountDao {
    async getAccountByUsername(un: string): Promise<Account> {
        const { resources } = await container.items.query({
            query: "SELECT * from A where A.username = @un",
            parameters: [{ name: "@un", value: un }]
        }, { maxItemCount: 1 }).fetchNext();

        return resources[0];
    }
    async createAccount(account: Account): Promise<Account> {
        account.id = v4();
        const response = await container.items.create(account);
        return response.resource;
    }

    async checkAccountById(id: string): Promise<boolean> {
        const response = await container.item(id, id).read<Account>();
        if (!response.resource)
            return false;
        else
            return true;
    }
    async getAccountById(ID: string): Promise<{ fname: string, lname: string, id: string }> {
        const response = await container.item(ID, ID).read<Account>();
        const { fname, lname, id } = response.resource;
        if (!response.resource)
            return null;
        else
            return { fname, lname, id };
    }
}