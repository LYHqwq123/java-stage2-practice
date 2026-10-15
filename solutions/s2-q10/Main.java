interface Vehicle {
    void start(String driverName);
    void stop(String driverName);
}

class Bike implements Vehicle {
    @Override
    public void start(String driverName) {
        System.out.println(driverName + "启动自行车");
    }

    @Override
    public void stop(String driverName) {
        System.out.println(driverName + "停止自行车");
    }
}

class Bus implements Vehicle {
    @Override
    public void start(String driverName) {
        System.out.println(driverName + "启动公交车");
    }

    @Override
    public void stop(String driverName) {
        System.out.println(driverName + "停止公交车");
    }
}

class Driver {
    public void drive(Vehicle v) {
        v.start("司机");
        v.stop("司机");
    }
}

public class Main {
    public static void main(String[] args) {
        Bike bike = new Bike();
        Bus bus = new Bus();
        Driver driver = new Driver();
        driver.drive(bike);
        driver.drive(bus);
    }
}
