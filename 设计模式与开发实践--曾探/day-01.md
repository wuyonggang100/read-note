多态：

- 同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结
  果。换句话说，给不同的对象发送同一个消息的时候，这些对象会根据这个消息分别给出不同的
  反馈。

- 多态背后的思想是将“做什么”和“谁去做以及怎样去做”分离开来，也就是将“不变的事
  物”与 “可能改变的事物”分离开来。
- 多态性的表现正是实现众多设计模式的目标。

实现多态：

使用继承来得到多态效果，是让对象表现出多态性的最常用手段。继承通常包括实现继承和接口继承。

- 实现继承

  ```js
  public abstract class Animal {
    abstract void makeSound(); // 抽象方法，由子类来实现   
  }
  public class Chicken extends Animal {
    public void makeSound() {
      System.out.println("咯咯咯");
    }
  }
  public class Duck extends Animal {
    public void makeSound() {
      System.out.println("嘎嘎嘎");
    }
  }
  Animal duck = new Duck(); // (1)
  Animal chicken = new Chicken(); // (2)
  // 现在剩下的就是让AnimalSound 类的makeSound 方法接受Animal 类型的参数，而不是具体的
  // Duck 类型或者Chicken 类型：
  public class AnimalSound {
    public void makeSound(Animal animal) { // 接受Animal 类型的参数
      animal.makeSound();
    }
  }
  
  // 测试
  public class Test {
    public static void main(String args[]) {
    AnimalSound animalSound = new AnimalSound();
    Animal duck = new Duck();
    Animal chicken = new Chicken();
      animalSound.makeSound(duck); // 输出嘎嘎嘎
      animalSound.makeSound(chicken); // 输出咯咯咯
    }
  }
  ```

  多态的思想实际上是把“做什么”和“谁去做”分离开来，要实现这一点，归根结底先要消除类型之间的耦合关系。如果类型之间的耦合关系没有被消除，那么我们在makeSound 方法中指定了发出叫声的对象是某个类型，它就不可能再被替换为另外一个类型。在Java 中，可以通过向上转型来实现多态。

  而JavaScript 的变量类型在运行期是可变的。一个JavaScript 对象，既可以表示Duck 类型的
  对象，又可以表示Chicken 类型的对象，这意味着JavaScript 对象的多态性是与生俱来的。

  多态最根本的作用就是通过把过程化的条件分支语句转化为对象的多态性，从而消除这些条件分支语句。























































