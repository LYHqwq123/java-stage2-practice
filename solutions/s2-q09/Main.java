import java.util.Scanner;

class Animal {
    protected String name;

    public Animal(String name) { this.name = name; }

    public void sing() {
        System.out.println(name + "在叫");
    }
}

class Cat extends Animal {
    private String furColor;

    public Cat(String name, String furColor) {
        super(name);
        this.furColor = furColor;
    }

    @Override
    public void sing() {
        System.out.println("猫" + name + "，毛色：" + furColor + "，喵喵喵");
    }
}

class Bird extends Animal {
    private String featherColor;

    public Bird(String name, String featherColor) {
        super(name);
        this.featherColor = featherColor;
    }

    @Override
    public void sing() {
        System.out.println("鸟" + name + "，羽毛颜色：" + featherColor + "，叽叽喳喳");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("1.Cat  2.Bird");
        int choice = sc.nextInt();
        Animal pet;
        if (choice == 1) {
            pet = new Cat("小花", "白色");
        } else if (choice == 2) {
            pet = new Bird("小黄", "黄色");
        } else {
            System.out.println("请选择1或2");
            return;
        }
        pet.sing();
    }
}
