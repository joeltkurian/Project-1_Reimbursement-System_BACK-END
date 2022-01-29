import { AccountDao } from "../DAOS/accountDAO";
import { Account } from "../entities";
import { checkAccountServiceImpl, checkAccountService } from "../Services/checkAccount-service"

describe("Check Account Service Tests", () => {
    const accountDaoStub: AccountDao = {
        async getAccountByUsername(username: string): Promise<Account> {
            // Checked in login-service where it's used
            throw new Error("Not Checking here!");
        },
        createAccount: function (account: Account): Promise<Account> {
            // No need to check since we won't be creating Accounts
            throw new Error("Not Checking here!");
        },
        async checkAccountById(id: string): Promise<boolean> {
            if (id == '101')
                return true;

            else
                return false;
        },
        async getAccountById(ID: string): Promise<{ fname: string; lname: string; id: string; }> {
            if (ID != '101')
                return null;
            else
                return { fname: 'Joel', lname: 'Kurian', id: '101' };
        }
    }

    const checkAccountService: checkAccountService = new checkAccountServiceImpl(accountDaoStub);
    it("Should return true for a valid account", async () => {
        expect(await checkAccountService.checkAccountId('101')).toBeTruthy;
    });
    it("Should return false for invalid account", async () => {
        expect(await checkAccountService.checkAccountId('201')).toBeFalsy;
    });
    it("Should get an object with fname, lname, and id that matches stub AccountDao return", async () => {
        const { fname, lname, id } = await checkAccountService.getAccountById('101');
        expect(fname).toBe('Joel');
        expect(lname).toBe('Kurian');
        expect(id).toBe('101');
    });
    it("Should throw error as incorrect accountID", async () => {
        try {
            const { fname, lname, id } = await checkAccountService.getAccountById('101');
        } catch (e) {
            e.message('Front-end passed incorrect account ID');
        }
    });
});