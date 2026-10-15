class NetworkUser {
    private String userId;
    private String password;
    private String email;

    public NetworkUser(String userId, String password, String email) {
        this.userId = userId;
        this.password = password;
        this.email = email;
    }

    public NetworkUser(String userId, String password) {
        this(userId, password, userId + "@gameschool.com");
    }

    public String getUserId() { return userId; }
    public String getEmail() { return email; }

    public void showInfo() {
        System.out.println("用户ID：" + userId + "，邮箱：" + email);
    }
}

public class Main {
    public static void main(String[] args) {
        NetworkUser u1 = new NetworkUser("zhangsan", "123456", "zhangsan@example.com");
        NetworkUser u2 = new NetworkUser("lisi", "abcdef");
        u1.showInfo();
        u2.showInfo();
    }
}
