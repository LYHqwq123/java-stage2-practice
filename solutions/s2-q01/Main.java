class Point {
    private double x;
    private double y;
    private double z;

    public Point() {
        this(0, 0, 0);
    }

    public Point(double x, double y, double z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public void setX(double x) { this.x = x; }
    public void setY(double y) { this.y = y; }
    public void setZ(double z) { this.z = z; }

    public double getDistance() {
        return x * x + y * y + z * z;
    }
}

public class Main {
    public static void main(String[] args) {
        Point p1 = new Point();
        System.out.println("原点的距离平方：" + p1.getDistance());
        Point p2 = new Point(1, 2, 3);
        System.out.println("点(1,2,3)的距离平方：" + p2.getDistance());
        p1.setX(3);
        p1.setY(4);
        p1.setZ(0);
        System.out.println("点(3,4,0)的距离平方：" + p1.getDistance());
    }
}
