---
layout: post
title: "Liskov Substitution Principle (LSP): Keep the Promise"
series: solid-principles
part: 2
description: "A subtype that breaks its parent's promise is an LSP violation. Learn Design by Contract, see a broken gift card hierarchy, and how to fix it with interfaces."
date: 2026-03-28
lang: en
tags: [design-principles, oop, series]
tags_color: "#7C3AED"
permalink: /series/solid-principles/liskov-substitution-principle/
---

{: .prerequisites }
> Before reading, make sure you're comfortable with:
>
> - **Abstraction** — defining a contract (interface or abstract class) that others implement, without exposing how it works internally.
> - **Inheritance** — how a class derives structure or behavior from a parent. You should understand what it means for a class to extend another.
> - **Polymorphism** — the ability to treat different types uniformly through a shared contract. Not just knowing the word, but understanding why it's useful.

LSP is the **L** in [SOLID](/series/solid-principles/) — one of five design principles for writing maintainable object-oriented software.

## The Liskov Substitution Principle

Coined by Barbara Liskov in her [1987 work on data abstraction and type theory](https://en.wikipedia.org/wiki/Liskov_substitution_principle):

> If for each object o1 of type S there is an object o2 of type T such that for all programs P defined in terms of T, the behavior of P is unchanged when o1 is substituted for o2, then S is a subtype of T.
> <cite>Barbara Liskov</cite>

Robert C. Martin distilled it in his 2000 paper [*Design Principles and Design Patterns*](https://en.wikipedia.org/wiki/SOLID): *"Derived classes should be substitutable for their base classes."* Meaning — if a function works with a base type `B`, it should work just as well when passed a derived type `D`, without knowing the difference.

```csharp
void F(B baseClass);

F(new B()); // valid
F(new D()); // valid -- D is substitutable for B
```

The key implication: a derived class cannot strengthen preconditions or weaken postconditions. When it does, callers that trusted the base contract get burned.

## When a Subtype Breaks Its Promise

Imagine a payment system. We have a base `PaymentProcessor` that handles charging and refunding:

```csharp
class PaymentProcessor
{
    public virtual void Charge(decimal amount, string accountId) { ... }
    public virtual void Refund(decimal amount, string accountId) { ... }
}
```

Now we add a `GiftCardProcessor`. Gift cards can be charged, but they're non-refundable by policy. So someone writes:

```csharp
class GiftCardProcessor : PaymentProcessor
{
    public override void Refund(decimal amount, string accountId)
    {
        throw new NotSupportedException("Gift cards cannot be refunded.");
    }
}
```

Reasonable at first glance. But the billing service that processes returns doesn't know about this:

```csharp
void ProcessReturn(PaymentProcessor processor, decimal amount, string accountId)
{
    processor.Refund(amount, accountId);
}
```

Pass a `GiftCardProcessor` here and it throws. The function had no way to know — and shouldn't have to know. That's the violation. `GiftCardProcessor` inherits from `PaymentProcessor`, but it isn't truly substitutable for it.

### The Type Check Creep

This forces callers to start adding type checks:

```csharp
void ProcessReturn(PaymentProcessor processor, decimal amount, string accountId)
{
    if (processor is GiftCardProcessor)
        return;

    processor.Refund(amount, accountId);
}
```

And now we're right back to the `if/else` chains the [Open-Closed Principle (OCP)](/series/solid-principles/open-closed-principle/) warned us about. Every new processor type means touching this function again. Robert C. Martin called this connection out directly:

{: .important }
Violations of LSP are latent violations of OCP.

## A Method Is a Contract

To understand *why* this is a violation and not just an inconvenience, we need to talk about **Design by Contract** — a principle by Bertrand Meyer stating that every method carries an explicit agreement with its callers, expressed through two rules: a *precondition* (what must be true before the method is called) and a *postcondition* (what the method guarantees will be true once it completes).

Think of it like a function making a deal with whoever calls it:

- **Precondition** — the caller's obligation. "I'll only call you if these conditions are met."
- **Postcondition** — the method's obligation. "If you held up your end, I guarantee this outcome."

### Stronger In, Weaker Out

A simple example. A `Withdraw` method on a bank account might say:

```csharp
// Precondition: amount > 0 && amount <= balance
// Postcondition: balance == old_balance - amount
void Withdraw(decimal amount) { ... }
```

The caller must pass a valid amount. The method must correctly reduce the balance. Both sides are bound.

Now, where LSP enters: when a derived class overrides a method, it must honor the same contract — or a looser one. Specifically:

- It **cannot strengthen the precondition** — it can't demand more from the caller than the base class did.
- It **cannot weaken the postcondition** — it can't promise less than the base class did.

Back to our example. `PaymentProcessor.Refund` had an implicit postcondition: *the refund will be processed.* `GiftCardProcessor` weakened that postcondition by throwing instead of refunding. The contract was broken.

A derived class that weakens a postcondition is no longer trustworthy as a substitute. The caller followed the rules — and still got burned.

## The Hierarchy Was Wrong From the Start

The root cause was a bad hierarchy. `GiftCardProcessor` isn't a full `PaymentProcessor` — it's a *chargeable* thing that doesn't support refunds. The inheritance was wrong from the start.

Splitting the contract makes this honest:

```csharp
interface IChargeable
{
    void Charge(decimal amount, string accountId);
}

interface IRefundable
{
    void Refund(decimal amount, string accountId);
}

class CreditCardProcessor : IChargeable, IRefundable { ... }
class GiftCardProcessor : IChargeable { ... }
```

Now `ProcessReturn` asks for exactly what it needs:

```csharp
void ProcessReturn(IRefundable processor, decimal amount, string accountId)
{
    processor.Refund(amount, accountId);
}
```

A `GiftCardProcessor` can never be passed here — not because we added a guard, but because the type system prevents it. The contract is enforced before the code runs.

## The Cost of Getting It Wrong

LSP violations don't announce themselves. They hide behind inheritance decisions that looked reasonable at the time, and surface — sometimes much later — in code that never touched the bad hierarchy.

The visible symptom is usually a runtime exception from code that did everything right. The caller used the base type's contract faithfully. The function signature said `PaymentProcessor`. Nothing hinted that `Refund` might throw. The exception isn't a bug in the caller — it's a broken promise buried in the subtype.

The less visible symptom is worse. `is` and `as` checks start appearing at call sites — small type checks, scattered decisions, each one a sign that callers have stopped trusting the abstraction. Once that erosion starts, it compounds. Tests begin branching on concrete type. Shared behavior test suites quietly stop being shared. Nobody owns the moment it went wrong.

The most dangerous form is when nothing throws at all. A subtype that silently no-ops a refund, or writes to a different location, produces no error and no obvious signal. It just produces the wrong result — and that can go undetected through entire release cycles.

Each violation also quietly invites an `if/else` back in. Which means every LSP violation is an [OCP violation](/series/solid-principles/open-closed-principle/) waiting to happen. The hierarchy you built to stay flexible becomes the thing you're constantly working around.

Design your hierarchies around what types can *genuinely guarantee*, not just what they happen to share. A smaller, honest contract beats a large one with exceptions.
