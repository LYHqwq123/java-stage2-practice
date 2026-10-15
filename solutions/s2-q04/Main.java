class BankAccount {
    private String account;
    private double balance;

    public BankAccount(String account, double balance) {
        setAccount(account);
        setBalance(balance);
    }

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) {
        if (balance < 0) {
            throw new IllegalArgumentException("余额不能为负数");
        }
        this.balance = balance;
    }

    public void deposit(double money) {
        if (money <= 0) {
            System.out.println("存款金额必须大于0");
            return;
        }
        balance += money;
        System.out.println("存款成功：" + money + "元");
    }

    public void withdraw(double money) {
        if (money <= 0) {
            System.out.println("取款金额必须大于0");
            return;
        }
        if (money > balance) {
            System.out.println("余额不足，取款失败");
            return;
        }
        balance -= money;
        System.out.println("取款成功：" + money + "元");
    }

    public void queryBalance() {
        System.out.println("账号：" + account + "，余额：" + balance + "元");
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount ba = new BankAccount("123456", 500);
        ba.deposit(1000);
        ba.withdraw(2000);
        ba.queryBalance();
    }
}
