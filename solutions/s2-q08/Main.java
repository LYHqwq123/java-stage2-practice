class People {
    protected String name;
    protected int age;

    public People(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public int getAge() { return age; }
}

class Employee extends People {
    protected String empno;

    public Employee(String name, int age, String empno) {
        super(name, age);
        this.empno = empno;
    }

    public void showInfo() {
        System.out.println("员工：" + name + "，年龄：" + getAge() + "，工号：" + empno);
    }
}

class Teacher extends People {
    protected String teano;
    protected String grade;

    public Teacher(String name, int age, String teano, String grade) {
        super(name, age);
        this.teano = teano;
        this.grade = grade;
    }

    public void showInfo() {
        System.out.println("教师：" + name + "，年龄：" + getAge()
            + "，教师号：" + teano + "，年级：" + grade);
    }
}

public class Main {
    public static void main(String[] args) {
        Employee e = new Employee("张三", 25, "E001");
        Teacher t = new Teacher("李四", 35, "T001", "大二");
        e.showInfo();
        t.showInfo();
    }
}
