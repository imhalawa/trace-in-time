---
layout: post
title: "Dependency Inversion Principle (DIP): Depend on Abstractions"
series: solid-principles
part: 3
description: "DIP is the mechanism behind OCP. Learn why policy shouldn't depend on details, see a broken report generator, and how inverting dependencies fixes it."
date: 2026-03-28
lang: en
tags: [design-principles, oop, series]
tags_color: "#7C3AED"
permalink: /series/solid-principles/dependency-inversion-principle/
---

{: .prerequisites }
> Before reading, make sure you're comfortable with:
>
> - **Abstraction** — defining a contract (interface or abstract class) that others implement, without exposing how it works internally.
> - **Inheritance** — how a class derives structure or behavior from a parent. You should understand what it means for a class to extend another.
> - **Polymorphism** — the ability to treat different types uniformly through a shared contract. Not just knowing the word, but understanding why it's useful.

DIP is the **D** in [SOLID](/series/solid-principles/) — one of five design principles for writing maintainable object-oriented software.

## The Dependency Inversion Principle

The principle is most commonly associated with Robert C. Martin, who stated it as:

> "Depend upon Abstractions. Do not depend upon concretions."
> <cite>Robert C. Martin</cite>

And offered this context alongside it:

> "If the OCP states the goal of OO architecture, the DIP states the primary mechanism. Dependency Inversion is the strategy of depending upon interfaces or abstract functions and classes, rather than upon concrete functions and classes."
> <cite>Robert C. Martin</cite>

Meaning — higher-level modules that define *what the system should do* should not be directly coupled to lower-level modules that define *how it happens*. Both should depend on a shared abstraction instead.

A **policy** is a module that expresses a business rule or decision — *what* happens, independent of any particular technology or implementation. A **detail** is the module that carries out that decision — a specific database, a specific API, a specific file format. DIP is about keeping those two concerns from locking onto each other.

## When Policy Depends on Detail

Imagine a reporting system. It has a `SqlDatabase` that knows how to query order records, and a `ReportGenerator` that decides what a report contains and when it should be produced. They're two separate concerns — one is infrastructure, the other is business logic. The problem is how they're connected: `ReportGenerator` reaches directly into `SqlDatabase` to get its data, wiring the business logic to the infrastructure via `new`:

```csharp
class SqlDatabase
{
    public List<Order> GetOrders() { ... }
}

class ReportGenerator
{
    private readonly SqlDatabase _database = new SqlDatabase();

    public Report Generate()
    {
        var orders = _database.GetOrders();
        // build and return the report...
    }
}
```

This compiles, the tests pass, everything looks fine. The problem isn't visible yet.

Then a new requirement arrives: the system needs to support MongoDB. Or the team wants to write a unit test for `Generate()` without hitting a real database. Or the staging environment uses a different data source than production.

All three are the same problem. `ReportGenerator` has a hard dependency on `SqlDatabase` — a concrete class, wired directly into the policy via `new`. There is no seam. To test `Generate()` you need a real SQL connection. To swap the data source, you have to open `ReportGenerator` and edit it.

This is policy depending on detail. Every time the detail changes, the policy changes with it. The two modules cannot evolve independently.

In a real codebase it doesn't stop at one class. There's a `ScheduledReportJob` that creates its own `SqlDatabase`. A `ReportService` that does the same. An integration test trying to mock something that was never designed to be mocked. The concrete dependency spreads, and with it, everything that any variation would require changing.

One new requirement — swap the data source — and you're touching many files that were already working. This is what makes it a real problem: not just a code smell, but a **business cost**. The codebase becomes:

- **Rigid** — hard to change because policy is tied to a specific implementation
- **Fragile** — touching the concrete class risks breaking every caller
- **Hard to test** — no way to isolate the policy from its infrastructure

## Inverting the Dependency

The fix is direct: make `ReportGenerator` depend on an abstraction, not on `SqlDatabase`. The migration is three steps.

**Step 1: Define the abstraction.**

```csharp
interface IOrderRepository
{
    List<Order> GetOrders();
}
```

**Step 2: Make the concrete class conform to it.**

```csharp
class SqlOrderRepository : IOrderRepository
{
    public List<Order> GetOrders() { ... }
}
```

**Step 3: Make the policy depend on the abstraction.**

```csharp
class ReportGenerator
{
    private readonly IOrderRepository _repository;

    public ReportGenerator(IOrderRepository repository)
    {
        _repository = repository;
    }

    public Report Generate()
    {
        var orders = _repository.GetOrders();
        // build and return the report...
    }
}
```

`ReportGenerator` no longer knows about `SqlOrderRepository`. It doesn't know about MongoDB either. It knows only about `IOrderRepository` — a contract that says: *give me orders*. Any class that satisfies that contract can be passed in.

This is the inversion. Before:

- `ReportGenerator` → `SqlDatabase`

After:

- `ReportGenerator` → `IOrderRepository`
- `SqlOrderRepository` → `IOrderRepository`

Both sides point at the abstraction. The direct link from policy to detail is gone. `ReportGenerator` is now **closed for modification** — a new data source is a new class implementing `IOrderRepository`, not an edit to the report logic. That is exactly how DIP acts as the mechanism behind the [Open-Closed Principle (OCP)](/series/solid-principles/open-closed-principle/): the abstraction is the hinge point that keeps policy stable while details vary.

One detail worth being deliberate about: *who owns the interface?* The consumer does. `IOrderRepository` is defined by what `ReportGenerator` needs — not by what `SqlOrderRepository` happens to be able to provide. The interface lives with the policy, not with the implementation.

{: .important }
The policy module owns the contract. If `IOrderRepository` were defined inside the infrastructure layer, the policy would still indirectly depend on the infrastructure's decisions. The inversion only holds when the abstraction belongs to the side that consumes it.

## What About Object Creation?

After applying DIP, one question remains: *who creates the `SqlOrderRepository`?* Abstract types cannot be instantiated. Somewhere in the system, a concrete class must be selected and constructed.

The answer is not to avoid object creation — that is impossible. The answer is to **contain it**. Concrete dependencies belong at the edges of the system, where composition happens, not scattered through business logic.

```csharp
// Program.cs — the composition root
var repository = new SqlOrderRepository();
var generator  = new ReportGenerator(repository);
```

This is a **composition root** — a single place where concrete parts are wired together. Outside of it, `ReportGenerator` never mentions `SqlOrderRepository`. The dependency exists, but it is localized. Switching to MongoDB tomorrow means changing one line in one file.

This is the motivation behind patterns like Abstract Factory and modern dependency injection containers. The mechanism varies, but the goal is the same: creation is inevitable; its architectural impact can be contained.

## DIP, Dependency Injection, and IoC Containers

These three terms appear together so often that they tend to blur into each other. They are related, but they are not the same thing.

**DIP** is a design principle — the idea that modules should depend on abstractions rather than concretions. It says nothing about how those abstractions are wired up at runtime. That is a separate concern.

**Dependency Injection (DI)** is a technique for satisfying that concern. Instead of a class creating its own dependencies, they are passed in from outside — through a constructor, a method parameter, or a property. The composition root example above is DI in its simplest form: someone else builds the dependency and hands it over.

```csharp
// DI via constructor — ReportGenerator doesn't create its dependency
var generator = new ReportGenerator(new SqlOrderRepository());
```

DI is the most common way to apply DIP in practice, but it isn't the only way. You could also use a factory method, a service locator, or a configuration object. DI is a technique; DIP is the principle behind why you'd bother.

**Inversion of Control (IoC)** is the broader concept that both of them fall under. IoC means that control over a concern — object creation, execution flow, lifecycle — is moved out of the module that uses it and handed to something external. DI is one form of IoC. The Observer pattern is another. A plugin system is another. IoC describes the direction of control, not a specific mechanism.

**A DI container** (often also called an IoC container) is a tool that automates the wiring. Instead of manually composing the object graph at startup, you register types and their dependencies, and the container resolves them for you:

```csharp
// Registering types
services.AddScoped<IOrderRepository, SqlOrderRepository>();
services.AddScoped<ReportGenerator>();

// The container builds the graph — you never call new directly
var generator = serviceProvider.GetRequiredService<ReportGenerator>();
```

The container is a convenience. It doesn't change what DIP requires — `ReportGenerator` still depends on `IOrderRepository`, not on `SqlOrderRepository`. The container just handles the construction at scale, so you're not writing a manual composition root with hundreds of `new` calls.

The important distinction: **a container doesn't enforce DIP**. You can register a concrete class directly and inject it everywhere — that satisfies the container, but violates the principle. Conversely, you can follow DIP perfectly with no container at all, just a single manual composition root. The principle is about the direction of dependencies in your design. The container is about how those dependencies get built at runtime.

## What DIP Does for Testing

The bullet list earlier named testability as one of the costs of coupling policy to detail. Here is what that looks like in practice once the inversion is in place.

When a module depends directly on a concrete class — especially one with side effects like a database or an HTTP client — you can't test it in isolation. Every test becomes an integration test, whether you want it to be or not.

Once `ReportGenerator` depends on `IOrderRepository` instead of `SqlDatabase`, you can swap in a controlled substitute for any test:

```csharp
class FakeOrderRepository : IOrderRepository
{
    private readonly List<Order> _orders;

    public FakeOrderRepository(List<Order> orders)
    {
        _orders = orders;
    }

    public List<Order> GetOrders() => _orders;
}

// In your test:
var repository = new FakeOrderRepository([
    new Order { Id = 1, Total = 150.00m },
    new Order { Id = 2, Total = 80.00m }
]);
var generator = new ReportGenerator(repository);
var report = generator.Generate();

// Assert on the report — no database, no network, no setup
```

The test is fast, deterministic, and focused entirely on the logic inside `Generate()`. You control exactly what data comes in, so you can verify exactly what comes out.

This separation also clarifies the boundary between unit tests and integration tests. Unit tests verify the policy — does `ReportGenerator` produce the right report given these orders? Integration tests verify the detail — does `SqlOrderRepository` return the right records from the actual database? Each test does one job, and neither bleeds into the other.

Without DIP, that boundary doesn't exist. The policy and the infrastructure are fused, so every test has to deal with both.

## Choosing Where to Invert

DIP is not a blanket rule. Applying it everywhere adds indirection without benefit. The question is always the same: is this dependency a point of variation, or is it stable?

DIP makes sense where the variation is real and the dependency is volatile. `IOrderRepository` earns its existence because the data source is likely to change, and `ReportGenerator` needs to be testable in isolation. Both reasons are concrete.

Not every dependency warrants this treatment. The .NET BCL is concrete but stable — `System.DateTime`, `System.Math`, `List<T>`. A utility that formats a timestamp is concrete but unlikely to need substitution. That said, stability isn't a permanent guarantee — a concrete dependency that seems harmless today can become painful the moment requirements shift in a direction you didn't anticipate. An abstraction doesn't just reduce the chance of change; it reduces the cost of it.

The useful question is not *is this class concrete?* Almost every class is. The question is: **would a change to this dependency require me to change the module that uses it?** If yes, an abstraction is worth the investment. If the answer is a confident no — stable library, known behavior, no plans to vary it — the concrete dependency may be fine.

Apply DIP where policy is more stable than the detail it relies on. Skip it where you're adding indirection without a real variation point.

{: .note }
> DIP doesn't work in isolation. The abstractions it depends on are only as stable as the contracts themselves are well-designed. The Interface Segregation Principle addresses exactly that — keeping interfaces narrow and specific to each consumer, so they're cheaper to keep stable. We'll be covering ISP in the next part of this series.
