import express from 'express';
import { AccountDao, AccountDaoImpl } from './DAOS/accountDAO';
import { Account } from './entities';
import { LoginService, LoginServiceImpl } from './Services/login-service';
import cors from 'cors';
import errorHandler from './Error/incorrect-account';

const app = express();

app.use(express.json());
app.use(cors());

const accountDao: AccountDao = new AccountDaoImpl();
const loginService: LoginService = new LoginServiceImpl(accountDao);


app.get('/Hello', async (req, res) => {
    res.send('Hello');
});

//CREATE ACCOUNT (TEMPORARY)
app.post('/accountCreation', async (req, res) => {
    const acc: { fname: string, lname: string, username: string, password: string, id: string, isManager: boolean } = req.body;
    const account: Account = await loginService.createAccount(acc);
    res.status(201);
    res.send(account);
});

app.patch("/login", async (req, res) => {
    try {
        const user: { username: string, password: string } = req.body;
        const account: Account = await loginService.loginWithUsernamePassword(user.username, user.password);
        res.status(201);
        res.send(account);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

app.listen(5000, () => {
    console.log("Application has started!");
});