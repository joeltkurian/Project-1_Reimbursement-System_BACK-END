import { AccountDao } from "../DAOS/accountDAO";
import { Account } from "../entities";
import { IncorrectAccount } from "../Error/error"

export interface LoginService {
    loginWithUsernamePassword(username: string, password: string): Promise<Account>;
    createAccount(account: Account): Promise<Account>;
}

export class LoginServiceImpl implements LoginService {
    private accountDao: AccountDao;

    constructor(accountDao: AccountDao) {
        this.accountDao = accountDao;
    }

    async loginWithUsernamePassword(username: string, password: string): Promise<Account> {
        const account: Account = await this.accountDao.getAccountByUsername(username);
        if (account) {
            if (account.password !== password) {
                throw new IncorrectAccount("Incorrect Password!", true)
            }
            else {
                return account;
            }
        }
        else {
            throw new IncorrectAccount("User does not exist!", false);
        }
    }

    async createAccount(account: Account): Promise<Account> {
        const acc: Account = await this.accountDao.createAccount(account);
        return acc;
    }
}