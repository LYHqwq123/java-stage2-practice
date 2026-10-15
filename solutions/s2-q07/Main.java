class Person {
    private String name;
    private final String bloodType;
    private double height;

    public Person(String name, String bloodType, double height) {
        if (height < 0) {
            throw new IllegalArgumentException("身高不能为负数");
        }
        setName(name);
        this.bloodType = bloodType;
        this.height = height;
    }

    public String getName() { return name; }
    public String getBloodType() { return bloodType; }
    public double getHeight() { return height; }

    public void setName(String name) {
        if (name == null || name.length() < 2 || name.length() > 4) {
            throw new IllegalArgumentException("姓名必须为2～4个字符");
        }
        this.name = name;
    }

    public void addHeight(double increase) {
        if (increase < 0) {
            throw new IllegalArgumentException("身高不能减少");
        }
        height += increase;
    }
}

public class Main {
    public static void main(String[] args) {
        Person p = new Person("张三", "A", 170);
        System.out.println("姓名：" + p.getName() + "，血型：" + p.getBloodType()
            + "，身高：" + p.getHeight() + "厘米");
        p.setName("李小明");
        p.addHeight(2);
        System.out.println("修改后：" + p.getName() + "，身高：" + p.getHeight() + "厘米");
        try {
            p.setName("王");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        try {
            p.setName("一二三四五");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        try {
            p.addHeight(-5);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        System.out.println("最终：" + p.getName() + "，血型：" + p.getBloodType()
            + "，身高：" + p.getHeight() + "厘米");
    }
}
