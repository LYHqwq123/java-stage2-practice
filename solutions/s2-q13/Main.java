import java.util.Locale;

abstract class Shape {
    public abstract double getArea();
}

class Circle extends Shape {
    private double radius;

    public Circle(double radius) { this.radius = radius; }

    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
}

class Rectangle extends Shape {
    private double length;
    private double width;

    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }

    @Override
    public double getArea() {
        return length * width;
    }
}

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = {new Circle(3), new Rectangle(4, 5)};
        String[] names = {"圆面积", "矩形面积"};
        for (int i = 0; i < shapes.length; i++) {
            System.out.printf(Locale.ROOT, "%s：%.2f%n", names[i], shapes[i].getArea());
        }
    }
}
