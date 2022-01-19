import { AccountDao } from "../DAOS/accountDAO";
import { Account } from "../entities";
import { LoginService, LoginServiceImpl } from "../Services/login-service"


describe("Login Service Tests", () => {
    //stub implementation for testing our service logic
    // Some dummy guaranteed return value so i can write my test that i do not have to refactor
    const memberDaoStub: AccountDao = {
        async getAccountByUsername(username: string): Promise<Account> {
            if (username == "matt")
                return { id: "", fname: "matt", lname: "damon", username: "matt", password: "pass", isManager: false };


            else
                return null;
        },
        createAccount: function (account: Account): Promise<Account> {
            throw new Error("Not Checking!");
        },
        checkAccountById: function (id: string): Promise<boolean> {
            throw new Error("Function not implemented.");
        },
        getAccountById: function (id: string): Promise<Account> {
            throw new Error("Function not implemented.");
        }
    }

    const loginService: LoginService = new LoginServiceImpl(memberDaoStub);

    it("Should throw an error as username does not exist", async () => {
        try {
            await loginService.loginWithUsernamePassword('matta', "sdaf");
        } catch (e) {
            expect(e.message).toBe("User does not exist!");
        }
    })

    it("Should throw an error as password not right!", async () => {
        try {
            await loginService.loginWithUsernamePassword("matt", "dsa");
        } catch (e) {
            expect(e.message).toBe("Incorrect Password!");
        }
    })

    it("Should work as password matches username provided", async () => {
        const acc: Account = await loginService.loginWithUsernamePassword("matt", "pass");
        expect(acc.fname).toBe("matt");

    })
});