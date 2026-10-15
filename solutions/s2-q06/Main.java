class Book {
    private String author;
    private String title;

    public Book(String author, String title) {
        this.author = author;
        this.title = title;
    }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}

class Student {
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public void readBook(Book book) {
        System.out.println(age + "岁的" + name + "正在读的书是《"
            + book.getTitle() + "》");
    }
}

public class Main {
    public static void main(String[] args) {
        Book book = new Book("司马光", "资治通鉴");
        Student student = new Student("张三", 18);
        student.readBook(book);
    }
}
