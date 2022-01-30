import { AccountDao } from "../DAOS/accountDAO";

export interface checkAccountService {
    checkAccountId(accountId: string): Promise<boolean>;
    getAccountById(accountId: string): Promise<{ fname: string, lname: string, id: string }>;
}

export class checkAccountServiceImpl implements checkAccountService {
    private accountDao: AccountDao;

    constructor(accountDao: AccountDao) {
        this.accountDao = accountDao;
    }

    async checkAccountId(accountId: string): Promise<boolean> {
        return this.accountDao.checkAccountById(accountId);
    }

    async getAccountById(accountId: string): Promise<{ fname: string, lname: string, id: string }> {
        const account: { fname: string, lname: string, id: string } = await this.accountDao.getAccountById(accountId);
        if (account != undefined)
            return account;
        else
            throw new Error("Front-end passed incorrect account ID");

    }
}
