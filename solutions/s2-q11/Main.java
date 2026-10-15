import java.util.Locale;

class Circle {
    private double Radius;

    public Circle() { this(0); }

    public Circle(double r) {
        this.Radius = r;
    }

    public double getArea() {
        return Math.PI * Radius * Radius;
    }

    public double getPerimeter() {
        return 2 * Math.PI * Radius;
    }
}

class Cylinder extends Circle {
    private double height;

    public Cylinder(double r, double h) {
        super(r);
        this.height = h;
    }

    public double getBaseArea() {
        return super.getArea();
    }

    public double getVolume() {
        return super.getArea() * height;
    }

    @Override
    public double getArea() {
        return 2 * super.getArea() + super.getPerimeter() * height;
    }
}

public class Main {
    public static void main(String[] args) {
        Cylinder c = new Cylinder(3, 5);
        System.out.printf(Locale.ROOT, "圆面积：%.2f%n", c.getBaseArea());
        System.out.printf(Locale.ROOT, "圆周长：%.2f%n", c.getPerimeter());
        System.out.printf(Locale.ROOT, "圆柱体积：%.2f%n", c.getVolume());
        System.out.printf(Locale.ROOT, "圆柱表面积：%.2f%n", c.getArea());
    }
}
