class Animal {
    public double height;
    public Double weight;
    public String bodyColor;

    public Animal(double height, Double weight, String bodyColor) {
        this.height = height;
        this.weight = weight;
        this.bodyColor = bodyColor;
    }
}

interface Ibehavior {
    void walking();
    void eating(String food);
}

class Lion extends Animal implements Ibehavior {
    public int toothNumber;
    public double tailLength;

    public Lion(double height, Double weight, String bodyColor,
                int toothNumber, double tailLength) {
        super(height, weight, bodyColor);
        this.toothNumber = toothNumber;
        this.tailLength = tailLength;
    }

    public void showInfo() {
        System.out.println("狮子：");
        System.out.println("体重：" + weight + "，体高：" + height + "，皮色："
            + bodyColor + "，牙齿数：" + toothNumber + "，尾巴长度：" + tailLength);
    }

    @Override
    public void walking() {
        System.out.println("狮子在奔跑！");
    }

    @Override
    public void eating(String food) {
        System.out.println("狮子在吃" + food);
    }
}

public class Main {
    public static void main(String[] args) {
        Lion lion = new Lion(0.6, 56.0, "黄色", 38, 1.2);
        lion.showInfo();
        lion.walking();
        lion.eating("野牛");
    }
}
