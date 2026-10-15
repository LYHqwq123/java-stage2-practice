class Phone {
    private String brand;
    private int price;

    public Phone() { }

    public Phone(String brand, int price) {
        this.brand = brand;
        this.price = price;
    }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public void call() {
        System.out.println("正在使用价格为" + price + "元的" + brand + "手机打电话");
    }

    public void listenMusic() {
        System.out.println("正在使用价格为" + price + "元的" + brand + "手机听歌");
    }
}

public class Main {
    public static void main(String[] args) {
        Phone p1 = new Phone();
        p1.setBrand("华为");
        p1.setPrice(998);
        Phone p2 = new Phone("小米", 998);
        p1.call();
        p2.listenMusic();
    }
}
