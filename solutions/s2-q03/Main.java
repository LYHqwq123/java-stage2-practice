class Student {
    public String name;
    private int age;
    private double height;
    private String grade;

    public Student() {
        this("未命名", 18, 1.60, "大一");
    }

    public Student(String name, int age, double height, String grade) {
        this.name = name;
        this.age = age;
        this.height = height;
        this.grade = grade;
    }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public void showInfo() {
        System.out.println("姓名：" + name + "，年龄：" + age
            + "，身高：" + height + "米，年级：" + grade);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "张三";
        s1.setAge(19);
        s1.showInfo();
        Student s2 = new Student("李四", 20, 1.75, "大二");
        s2.showInfo();
        System.out.println("李四的年龄：" + s2.getAge());
    }
}
