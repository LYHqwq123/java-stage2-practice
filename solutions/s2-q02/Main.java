import java.util.Scanner;

class Rectangle {
    private int length;
    private int width;

    public Rectangle(int length, int width) {
        this.length = length;
        this.width = width;
    }

    public int getArea() { return length * width; }
    public int getPerimeter() { return 2 * (length + width); }

    @Override
    public String toString() {
        return "这个长方形长为" + length + "，宽为" + width
            + "，面积为" + getArea() + "，周长为" + getPerimeter() + "。";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int length = sc.nextInt();
        int width = sc.nextInt();
        Rectangle r = new Rectangle(length, width);
        System.out.println(r.toString());
    }
}
