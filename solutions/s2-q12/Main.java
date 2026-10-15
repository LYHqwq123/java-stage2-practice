interface CanCry {
    public void cry();
}

class Dog implements CanCry {
    @Override
    public void cry() {
        System.out.println("我是狗，我的叫声是汪汪汪");
    }
}

class Cat implements CanCry {
    @Override
    public void cry() {
        System.out.println("我是猫，我的叫声是喵喵喵");
    }
}

class G {
    public void makeCry(CanCry c) {
        c.cry();
    }

    public static void main(String[] args) {
        Dog dog = new Dog();
        Cat cat = new Cat();
        G g = new G();
        g.makeCry(dog);
        g.makeCry(cat);
    }
}

public class Main {
    public static void main(String[] args) {
        G.main(args);
    }
}
