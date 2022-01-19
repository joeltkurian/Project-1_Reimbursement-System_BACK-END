import { AccountDao, AccountDaoImpl } from "../DAOS/accountDAO";
import { Account } from "../entities";
import { LoginService, LoginServiceImpl } from "../Services/login-service"


describe("Login Service Tests", () => {

    const accountDao: AccountDao = new AccountDaoImpl();
    const loginService: LoginService = new LoginServiceImpl(accountDao);

    it("Should throw an error as username does not exist", async () => {
        try {
            await loginService.loginWithUsernamePassword('jtk', "sdaf");
        } catch (e) {
            expect(e.message).toBe("User does not exist!");
        }
    });

    it("Should throw an error as password is not right!", async () => {
        try {
            await loginService.loginWithUsernamePassword("joelt", "asdfa");
        } catch (e) {
            expect(e.message).toBe("Incorrect Password!");
        }
    });

    it("Should work as password matches username provided", async () => {
        const acc: Account = await loginService.loginWithUsernamePassword("joelt", "joelt");
        expect(acc.fname).toBe("Joel");

    });

});