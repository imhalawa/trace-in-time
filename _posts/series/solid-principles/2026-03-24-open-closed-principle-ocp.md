---
layout: post
title: "Open Closed Principle (OCP): Extend Without Breaking"
series: solid-principles
part: 1
description: "Learn how the Open Closed Principle (OCP) lets you add new features without touching existing code. Includes C# examples of dynamic and static polymorphism."
date: 2026-03-24
lang: en
tags: [design-principles, oop, series]
tags_color: "#7C3AED"
permalink: /series/solid-principles/open-closed-principle/
---

{: .prerequisites }
> Before reading, make sure you're comfortable with:
>
> - **Abstraction** — defining a contract (interface or abstract class) that others implement, without exposing how it works internally. You need to know what an interface is and why we use one.
> - **Inheritance** — how a class derives structure or behavior from a parent. You don't need to be an expert, but you should know what `class A : B` means.
> - **Polymorphism** — the ability to treat different types uniformly through a shared contract. Not just knowing the word, but understanding why it's useful.

OCP is the **O** in [SOLID](/series/solid-principles/) — one of five design principles for writing maintainable object-oriented software.

## The Open-Closed Principle

The principle originated from the work of Bertrand Meyer in his 1988 book [*Object-Oriented Software Construction*](https://en.wikipedia.org/wiki/Object-Oriented_Software_Construction):

> "A module will be said to be open if it is still available for extension. A module will be said to be closed if it is available for use by other modules. This assumes that the module has been given a well-defined, stable description."
> <cite>Bertrand Meyer</cite>

Robert C. Martin later adopted the principle in his 2000 paper *Design Principles and Design Patterns*, stating it as:

> "A module should be open for extension but closed for modification."
> <cite>Robert C. Martin</cite>

Meaning — we should be able to extend what a module does without changing its source code.

## When Does This Actually Break?

Imagine we're building a notification system. Right now it supports email and SMS. The `Send` function looks fine, the logic is correct:

```csharp
enum NotificationType
{
    Email,
    SMS
}

class Notification
{
    public NotificationType Type { get; set; }
    public string Recipient { get; set; }
    public string Message { get; set; }
}

void Send(Notification notification)
{
    if (notification.Type == NotificationType.Email){
        SendEmail(notification);
    }
    else if (notification.Type == NotificationType.SMS)
    {
        SendSMS(notification);
    }
}
```

Now the team wants to add push notifications. Simple enough — we open `Send`, add a new `else-if` branch, done. A month later: Slack notifications. Another branch. Then webhooks. Then in-app alerts.

With new channels being introduced, the maintainers are required to touch `Send` — a function that was already working. Is it broken? Maybe yes, maybe no, but the risk is higher. In a real codebase, `Send` is rarely the only place that needs updating. There's usually a factory somewhere, a config file, a test suite, maybe a docs page.

One new feature, many files touched. Things potentially break, or get introduced with an ugly workaround, because the initial design was rigid enough that it didn't allow extending the behaviour or replacing it. The team slows down — either busy doing regression tests or struggling to introduce the new feature. Releases take longer. So, the more this pattern repeats, the more fragile the codebase becomes — every change is a risk because no one is fully sure what else might break.

Remember that piece of code that felt like rocket science? It's an outcome of rigidity.

This is what makes it a real problem — not just a code smell, but a **business cost**. The codebase becomes:

- **Rigid** — hard to change because every change ripples outward
- **Fragile** — things break in places you didn't expect or touch
- **Harder to test** — touching existing logic means re-verifying things that already worked

And at scale, this compounds into a **shotgun surgery** situation — introducing one new feature forces you to touch many unrelated parts of the codebase at once.

Worse, developers start taking local shortcuts. Maybe email and SMS share the same delivery logic, so someone writes:

```csharp
if (notification.Type == NotificationType.Slack)
    SendSlack(notification);
else
    SendEmail(notification); // SMS quietly falls through here too
```

Now Slack is explicit, but SMS is silently handled inside the `else`. A new maintainer reads this and has no idea. They change the email logic — and SMS breaks. The code is no longer trustworthy — because implicit behavior is being treated as explicit. *Prefer explicit over implicit, always.*

A few problems follow from this pattern:

- It's no longer clear what notification types are being handled — some are implicit, hidden in else branches.
- Implicitly handled types are error-prone. A change to one silently breaks the other.
- This leads to harder maintainability, more error-prone, untrustworthy code.

## How to Fix It?

The key to OCP is abstraction, achievable through one of two techniques: dynamic polymorphism or static polymorphism. The migration path from the if/else design is straightforward:

1. Define an `INotificationChannel` interface with a `Notify` method.
2. Create a separate class for each channel that implements the interface.
3. Replace `Send` with a `Dispatch` function that accepts `INotificationChannel`.
4. Delete the `NotificationType` enum — the type is now encoded in the class itself.

### Dynamic Polymorphism

Instead of `Send` knowing about every notification type, we define a shared contract — an interface — that every channel must implement. `Send` talks to the contract, not to any specific channel. A new channel is a new class that satisfies the contract. Nothing else gets touched.

With dynamic polymorphism, behavior is resolved at runtime — the method dispatch happens while the program is running, not at compile time. `Dispatch` doesn't need to know whether it's dealing with email, SMS, or Slack.

```csharp
interface INotificationChannel
{
    void Notify(Notification notification);
}

class EmailChannel : INotificationChannel { ... }
class SMSChannel : INotificationChannel { ... }
class SlackChannel : INotificationChannel { ... }

void Dispatch(INotificationChannel channel, Notification notification)
{
    channel.Notify(notification);
}
```

The interface enforces a `Notify` method on every channel. The `Dispatch` function relies on exactly that contract — it calls `channel.Notify` without knowing which channel it's talking to.

With this in place:

- `Dispatch` is **closed for modification** — we never touch it again.
- It's **open for extension** — new channels can be introduced without disturbing anything existing.
- We don't have to worry about breaking channels we never touched.

### Static Polymorphism

Another technique is generics. With static polymorphism, behavior is determined by the type at compile time rather than at runtime — C#, Rust, Go, and TypeScript all support some form of this. Instead of a runtime abstraction, the type is constrained at compile time:

```csharp
interface INotificationChannel
{
    void Notify(Notification notification);
}

void Dispatch<TChannel>(TChannel channel, Notification notification)
    where TChannel : INotificationChannel
{
    channel.Notify(notification);
}
```

The tradeoff: less runtime flexibility — the concrete type must be known at compile time, so you can't swap in a new channel without recompiling. In return, constraint violations are caught before the program ever runs, and the compiler can resolve method calls directly rather than deferring that decision to runtime.

Use dynamic polymorphism when channel implementations are loaded from a DI container or resolved at runtime — for example, when the active notification tier is read from a config file. Use static polymorphism when the type is fixed at the call-site and the overhead of a virtual dispatch matters.

## What Does a Codebase Look Like When This Is Done Right?

New features arrive as new files, not as edits to existing ones. The `Send` function from our example never gets touched again — it just works, regardless of how many channels get added after it. The team ships faster because they're adding, not untangling.

This pattern is visible in well-designed frameworks. ASP.NET Core's middleware pipeline is a textbook example: you register middleware via `app.Use()` without modifying the pipeline host itself. Each middleware is a self-contained extension — the host never changes, the behavior expands.

That's the real payoff of OCP. Not cleaner code for its own sake, but a codebase that doesn't slow you down as it grows. Requirements change — they always do. The question is whether your design bends or breaks when they do.

Full conformance is hard. But even partial OCP compliance changes the shape of how a system ages. If you don't have to change working code, you aren't likely to break it.

## When Should You Actually Apply This?

OCP makes sense where you can already see the variation coming. If the team knows Slack and push notifications are next on the roadmap, designing around `INotificationChannel` upfront isn't premature — the abstraction reflects something real. You're not guessing; you're encoding what you already know into the structure of the code.

The risk is applying it as a general hedge. Introducing an interface because *something* might change someday means guessing at the boundary — and wrong abstractions are harder to undo than no abstraction at all. An extensibility point that never gets used isn't just wasted effort; it adds complexity that future maintainers have to work around.

The useful question isn't "could this change?" — almost anything could. It's "do I know *where* this is likely to change?" When that's clear, OCP gives you a place to encode that assumption directly. When it isn't, the abstraction is a bet you haven't priced yet.

Not every module warrants this. `Dispatch` is worth protecting because it's a coordination point — new channels are a near-certainty. A function that formats a timestamp probably isn't.

Apply OCP where the direction of change is clear. Skip it where you're guessing.
