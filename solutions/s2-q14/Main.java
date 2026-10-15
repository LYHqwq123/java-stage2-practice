import java.util.Locale;

class Employee {
    private String name;
    private int age;
    private double basic;
    private double allowance;
    private double tax;

    public Employee(String name, int age, double basic, double allowance, double tax) {
        this.name = name;
        this.age = age;
        this.basic = basic;
        this.allowance = allowance;
        this.tax = tax;
    }

    public double getBasic() { return basic; }
    public double getAllowance() { return allowance; }

    public double total() {
        return basic + allowance - tax;
    }

    public void showInfo() {
        System.out.printf(Locale.ROOT,
            "%s 年龄%d 基本工资%.2f 津贴%.2f 扣税%.2f 应发总工资%.2f%n",
            name, age, basic, allowance, tax, total());
    }
}

public class Main {
    public static void main(String[] args) {
        Employee[] employees = {
            new Employee("孙悟空", 22, 3210, 1240, 280),
            new Employee("猪八戒", 21, 1820, 980, 160),
            new Employee("沙和尚", 28, 2100, 1020, 210),
            new Employee("白骨精", 18, 2560, 1320, 245)
        };
        double sumBasic = 0;
        double sumAllowance = 0;
        for (int i = 0; i < employees.length; i++) {
            sumBasic += employees[i].getBasic();
            sumAllowance += employees[i].getAllowance();
        }
        System.out.printf(Locale.ROOT, "平均基本工资：%.2f%n", sumBasic / employees.length);
        System.out.printf(Locale.ROOT, "平均津贴：%.2f%n", sumAllowance / employees.length);
        for (int i = 0; i < employees.length; i++) {
            employees[i].showInfo();
        }
    }
}
