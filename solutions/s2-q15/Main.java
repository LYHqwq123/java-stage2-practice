interface Graph {
    void drawing();
}

class Rectangle implements Graph {
    private double length;
    private double width;

    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }

    @Override
    public void drawing() {
        System.out.println("绘制矩形：长=" + length + "，宽=" + width);
    }
}

class Circle implements Graph {
    private double radius;

    public Circle(double radius) { this.radius = radius; }

    @Override
    public void drawing() {
        System.out.println("绘制圆：半径=" + radius);
    }
}

class Triangle implements Graph {
    private double a;
    private double b;
    private double c;

    public Triangle(double a, double b, double c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    @Override
    public void drawing() {
        System.out.println("绘制三角形：三边=" + a + "、" + b + "、" + c);
    }
}

class Client {
    public void myDrawing(Graph graph) {
        graph.drawing();
    }
}

public class Main {
    public static void main(String[] args) {
        Client client = new Client();
        client.myDrawing(new Rectangle(4, 3));
        client.myDrawing(new Circle(2));
        client.myDrawing(new Triangle(3, 4, 5));
    }
}
