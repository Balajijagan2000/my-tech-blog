---
title: 'Singleton Pattern - Complete Guide'
description: 'Singleton pattern is a creational design pattern that ensures a class has only one instance and provides a global point of access to it.'
pubDate: 'Jun 15 2026'
heroImage: '../../assets/singleton_pattern_hero.png'
tags: ['design-pattern', 'java', 'creational pattern', 'singleton pattern']
---

#### Before diving into the ***Singleton*** pattern, let us first understand what is a design pattern ?

Let us assume that you are developing a software and you got stuck with a problem during development. Then you started searching on the internet or asked your friends for help and finally you found a solution to your problem. Similarly, many developers might have faced the same problem and found the solution. So, the same problem can occur many times with different developers and the same solution can be used by them to solve their problem. In order to solve this recursively recurring problem [***Design Pattern***](https://en.wikipedia.org/wiki/Design_pattern) is introduced. 

***Design pattern*** is a reusable solution to commonly occurring problems in software development. They are like a pre-made template or blueprint that you can use to solve a recurring design problem in your code.

These design patterns are classified into 3 categories:

1. Creational Patterns - deals with object creation.
2. Structural Patterns - deals with the composition of classes and objects.
3. Behavioral Patterns - deals with the communication between objects and interaction among them.

Now let us talk about ***Singleton Pattern*** which is a creational pattern with realtime examples using Java.

---

#### Singleton Pattern
The ***Singleton Pattern*** ensures a class has only one instance and provides a global point of access to it.

That is we can only create one instance of a class, and that instance can be accessed globally.
Before going deep into ***Singleton Pattern*** let's look at the simple structure of the ***Singleton Pattern***

```
+-----------------------------------------------------------+
|                         Singleton                         |
+-----------------------------------------------------------+
| - instance : Singleton [static]                           | --> Private Sinleton Instance.
+-----------------------------------------------------------+
| - Singleton()                                             | --> Private constructor to prevent instantiation from outside.
| + getInstance() : Singleton [static]                      | --> Static method to get the single instance.
| + doSomething()                                           | --> Business methods.
+-----------------------------------------------------------+
```

#### Now let us look deep into Singleton Pattern

How will you create an instance of a class? Probably using `new` keyword right?


Yes, you will be using `new MyClass()` to create objects. 

So, everytime you use `new MyClass()` a new object is created and memory space is allocated for it in the memory. Is this what we want?

No, right?

We want to have only one instance of a class and that instance should be accessed globally. But using `new` will create object every time it is called. 

So think about how would you make a class so that it will restrict multiple instances to be created using `new` keyword?

What about making the constructor of the class from ***public*** to ***private***?

Let's try this: 

```java
class Singleton {

    private Singleton() {}

    // other properties and methods
}
```
 
Now we have made the constructor `private`. But how would you create the single instance as we made the constructor `private` which makes it unaccessible outside the same class?

How about declaring a `static` variable of the same class type and implement a `static` method to get that static instance?

Let's try this: 

```java
class Singleton {

    private static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {

        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }

    // other properties and methods...
}
```

Boom💥 we created a classical ***Singleton Pattern***

Let's look at the above code.

1. Note that we have `private static Singleton instance;` This is a static variable which will hold the single instance of the class.
2. To initialize and access the single instance we have implemented a ***static method*** called ***`getInstance()`***.
3. Note that we have ***`private Singleton() {}`*** This is a private constructor which will prevent the creation of multiple instances of the class.

Now that we created a classical and simple ***Singleton Pattern*** class, let us verify its working by creating multiple instances of the class.

```java
public class SingletonHelper {

	public static void main(String[] args) {
		
	Singleton obj1 = Singleton.getInstance();
	Singleton obj2 = Singleton.getInstance();
		
		
	System.out.println("Obj1 hash: "+obj1.hashCode());
	System.out.println("Obj2 hash: "+obj2.hashCode());
		
	}
}
```

```
Output:
Obj1 hash: 798154996
Obj2 hash: 798154996
```

Wow! Isn't it amazing? No matter how many times you call `getInstance()` method it will always return the same instance. From the output we can see that both obj1 and obj2 have the same hashcode. So this confirms that we have only one instance of the class.

Finally we have implemted the ***Singleton Pattern*** right? But wait! Is this approach thread-safe?
What if multiple threads try to enter the `getInstance()` method at the same time? Let's try this out.

```java
public class SingletonHelper {

	public static void main(String[] args) {
		
	Thread t1 = new Thread(() -> {
		Singleton s = Singleton.getInstance();
			
		System.out.println("Thread 1 - Singleton obj hash: "+s.hashCode());
	});
		
	Thread t2 = new Thread(() -> {
		Singleton s = Singleton.getInstance();
			
		System.out.println("Thread 2 - Singleton obj hash: "+s.hashCode());
	});
		
		
	t1.start();
	t2.start();
		
		
	}
}
```

```
Output:
Thread 2 - Singleton obj hash: 504198715
Thread 1 - Singleton obj hash: 1812824852
```

From the output we can see that both threads have different hashcodes. This means that both threads created different instances of the class. So this approach is ***not thread-safe*** and this breaks the rule of ***Singleton Pattern*** rule as we are getting different objects in case of multiple threads tyring to get the instance.

Before we dive into the ***thread-safe*** implementation there are multiple variations of ***Singleton Pattern*** and these variations are applied based on the scenarios. Let's look at them:

##### Thread-safe Singleton Pattern



```java
public class SingletonThreadSafe1 {
	
	private static SingletonThreadSafe1 instance;
	
	
	private SingletonThreadSafe1() {}
	
	
	public static synchronized SingletonThreadSafe1 getInstance() {
		
		if(instance == null) {
			instance = new SingletonThreadSafe1();
		}
		return instance;
	}

}
```

Here we just added ***synchronized*** keyword to the ***getInstance()*** method which makes it ***thread-safe***.

But again this implementation is ***not optimized*** as it uses ***synchronization*** which is a costly operation and can degrade the performance of the application.

Think about `1000` threads try to access the ***getInstance()*** method at the same time.

What will happen? Only `1` thread will enter the `getInstance()` method at a time and all other `999` threads will wait for the `1` thread to finish and enter the `getInstance()` method. This is very inefficient and causes perfomance bottlenecks. To overcome this problem ***Double-Checked Locking*** approach is introduced.


##### Double-Checked Locking

In the above approach we have placed the `synchronized` keyword at method level of `getInstance()` method. When 1st thread enters ***synchronized getInstance()*** method it will check whether the instance is null or not. If the instance is null it will create a new instance for the first time and then it will exit the ***synchronized getInstance()*** method and returns the instance. Now the 2nd thread will enters the ***synchronized getInstance()*** method it will check whether the instance is null or not. Since the instance is already created in the previous step it will exit the ***synchronized getInstance()*** method and returns the instance. The thing is 1st thread already created the instance and when other threads request for the object we just need to return the created object without entering the ***synchronized getInstance()*** method. So this reduces the overhead of ***synchronization*** and improves the performance of the application.

How about moving the `synchronized` keyword to the `if` block which checks the instance is `null`?

Let us first implement Double-Checked Locking pattern and we will look deep into it.


```java
public class SingletonDoubleCheckedLocking {

    private static volatile SingletonDoubleCheckedLocking instance;

    private SingletonDoubleCheckedLocking() {}

    public static SingletonDoubleCheckedLocking getInstance() {

        if (instance == null) {

            synchronized (SingletonDoubleCheckedLocking.class) {

                if (instance == null) {
                    instance = new SingletonDoubleCheckedLocking();
                }
            }
        }
        return instance;
    }
}
````

As we discussed above we have moved the `synchronized` keyword down as a block and also introduce one extra `null` check. You may wonder why we have introduced the extra `null` check?

Assume that there is only one `null` check like the below block:

```java
public static SingletonDoubleCheckedLocking getInstance() {

    if (instance == null) {

        synchronized (SingletonDoubleCheckedLocking.class) {
        instance = new SingletonDoubleCheckedLocking();
            
		}
    }
    return instance;
}
```

In the above block, let us say `1000` threads try to access the `getInstance()` method at the same time. Initially 1st thread will enter the `if (instance == null)` condition and checks if the instance is null or not. It is first time so the instance is null. Now it will enter the synchronized block and creates the instance. Now when 2nd thread enters the `if (instance == null)` condition it will find that the instance is not null and it will exit the synchronized block and returns the instance. Even though we rewrote the `getInstance()` method as a `synchronized block` and inside the block we are checking for `null` check, still it is not optimized as one thread need to wait for other to complete even the instance is already created.

To overcome this problem we have introduced the extra `null` check in the `Double-Checked Locking` approach. Now let us look deep into the `Double-Checked Locking` approach. In the `Double-Checked Locking` approach we have two `null` checks. The first `null` check is outside the `synchronized` block and the second `null` check is inside the `synchronized` block. 

Assume that `1000` threads try to access the `getInstance()` method at the same time. Initially 1st thread will enter the `if (instance == null)` condition and checks if the instance is null or not. It is first time so the instance is null. Now it will enter the synchronized block and creates the instance. Now when 2nd thread enters the `if (instance == null)` condition it will find that the instance is not null and it will exit the synchronized block and returns the instance. The same will happen for all other threads also. So this approach is optimized and it is thread-safe.

One important to notice in ***Double Checked Locking*** approach is the usage of `volatile` keyword. The `volatile` keyword ensures that the instance is always accessed from the main memory and not from the cache. Without volatile keyword, the instance may be created by one thread and it may be cached by other threads and returned from cache, leading to multiple instances of the Singleton class.

Now we have implemented our ***thread-safe*** and ***optimized*** Singleton Pattern. But again this implementation is not ***perfect*** as it uses ***synchronization*** which is a costly operation and can degrade the performance of the application based on where it is applied. 

**Pitfalls of Double Checked Locking**
1. Complex and error-prone due to ***synchronization*** and ***volatile*** usage.
2. By using ***Reflection*** the ***Double Checked Locking*** approach can be broken as we can create multiple instances of the Singleton class.
3. If ***Serialization*** is used, the ***Double Checked Locking*** approach can be broken as we can create multiple instances of the Singleton class.

Let's move on to the next variation called `enum` based Singleton Pattern.

##### Enum based Singleton Pattern

**What is enum?**

`enum` is a special data type used to define group of named ***constants***. These constants are treated as objects and can have their own methods and fields. By default the ***enum constants*** are `public`, `static` and `final`.
`enum` follows `class` implementation so each ***enum constant*** is nothing but an reference to is own ***enum object***. As the constants are `static` it can be accessed thourgh the `enum name`. 

These features of `enum` is used to implement one of the ***efficient***, ***optimized*** and ***thread-safe*** Singleton Pattern variation.

```java
public enum EnumSingleton {
	
	INSTANCE; // enum constant | public static final by default
	
	public int count; // custom fields
	
	private EnumSingleton() {
		this.count = 0;
	}
	public void printSomething() {
		
		System.out.println("This is Singleton Pattern using Enum");
	}
	

	public int getCount() {
		return this.count;
	}
	
	public void incrementCount() {
		this.count++;
	}
	
	// ... other methods

}

```

How would you access enum based Singleton Pattern?
As `enum` constant are `static` by default so we can access them by the `enum` class name.

```java
public class SingletonHelper {

	public static void main(String[] args) {
		
		EnumSingleton e1 = EnumSingleton.INSTANCE;
		e1.incrementCount();
		EnumSingleton e2 = EnumSingleton.INSTANCE;
		e2.incrementCount();
		System.out.println("Enum e1 hash: "+e1.hashCode());
		System.out.println("Enum e2 hash: "+e2.hashCode());

	}
}
```

Now you might think that how `EnumSingleton.INSTANCE` created the `EnumSingleton`?

For this we need to know important concept of how `enums` are created, then you would get some idea on how `enum` based Singleton Pattern works.

As discussed earlier `enum` is not only a group of named constants it can also have its own constructor, fields and methods like a normal `class`. So internally there will be a ***private constructor*** and a ***static block*** which calls the ***constructor*** to initialize the ***enum constants***. This process is done by JVM during `class loading` and when we call `EnumSingleton.INSTANCE` we get the reference to the ***enum constant*** which is already initialized by the JVM.

I hope now you get some idea on how this is working under the hood.

**Benefits of using Enum based Singleton Pattern**

1. It is ***thread-safe*** as it is initialized by the JVM during `class loading` and JVM will manages locking.
2. Simple to create and use. There is no much boiler plate code like use of `synchronization`, `volatile` and `getInstance()` method to get the object.
3. As it loads at compile-time it is gauranteed that only one instance exists.
4. Reflection and Serialization cannot break the Singleton Pattern.

#### Eagerly Initialized Singleton Pattern

One last variation of Singleton Pattern is ***Eagerly Initialized Singleton Pattern***. In this approach we initialize the instance at the time of `class loading`. This approach is simple and it is ***thread-safe*** but it is not ***optimized*** as it creates the instance at the time of `class loading` even though it is not used.

```java

public class EagerSingleton {

    private static EagerSingleton instance = new EagerSingleton();

    private EagerSingleton() {}

    public static EagerSingleton getInstance() {
        return instance;
    }
}
```
From the above code you can see that it is similar to classic Singleton Pattern implementation but the only difference is that we are initializing the instance at the time of `class loading` and not using `synchronization` and `volatile` thread concepts as it is already ***thread-safe*** due to eager-initialization.

#### Applications of Singleton Pattern
1. **Logging** - Most of the logging frameworks uses singleton pattern to log messages to a file. This is because we can have only one logger instance to log messages to a file to avoid multiple logger instances writing to same logger file.
2. **Configuration Management** - Singleton pattern is used to load application configuration and make it available globally to all the components in the application. This is because we can have only one configuration instance to access the configuration to avoid multiple configuration instances accessing the configuration.
3. **Database Connection Pooling** - Singleton Pattern is applied in Database Connection Pooling which ensures only one database connection pool to manage database connections. This avoids multiple database connection pool instances from getting created which are costly to create and manage.
4. **Caches** -  Singleton Pattern is applied in caching to manage the same caching instance across the application to avoid creating multiple cache instances, so that all the app components read and write from same cache instance.
5. **Thread Pools** - Single Pattern is applied in thread pooling to manage the same thread pool instance across the application to avoid creating multiple thread pool instances and avoid over provisioning of threads.

***Singleton Pattern*** is applied in many more areas. I have just mentioned some of the common areas where it is applied and I will try to come with seperate blog on detailed application of ***Singleton Pattern***.

### Conclusion

As you know there are multiple variations and implementations of Singleton Pattern. Apart from these the ***enum based Singleton Pattern*** is the most recommended and efficient way to implement Singleton Pattern in Java but each variation has its own pros and cons. It is good to analyze which variation perfectly suits your requirement and then apply it. This would be all for this topic. In my next blog I will come up with other Design Pattern.



 


