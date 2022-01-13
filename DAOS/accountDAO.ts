import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";
import { Account } from "../entities";



const client = new CosmosClient(process.env.COSMOS_CONNECTION);
const database = client.database('rpas-db');
const container = database.container('Account');


export interface AccountDao {
    getAccountByUsername(username: string): Promise<Account>;
    createAccount(account: Account): Promise<Account>;
}

export class AccountDaoImpl implements AccountDao {
    async getAccountByUsername(un: string): Promise<Account> {
        const { resources } = await container.items.query({
            query: "SELECT * from A where A.username = @un",
            parameters: [{ name: "@un", value: un }]
        }).fetchAll();
        return resources[0];
    }
    async createAccount(account: Account): Promise<Account> {
        account.id = v4();
        const response = await container.items.create(account);
        return response.resource;
    }
}