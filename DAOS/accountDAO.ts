import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";
import Account from "../Entities/account";



const client = new CosmosClient(process.env.COSMOS_CONNECTION);
const database = client.database('rpas-db');
const container = database.container('Account');

export default class ClientDAO{
    async createAccount(account: Account):Promise<Account>{
        account.id = v4();
        const response = await container.items.create(account);
        return response.resource;
    }
}