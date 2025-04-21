---
layout: post
title: Commit literature in an Enterprise Setup
description: Commit in a reasonable way my dear!
date: 2022-06-06
categories:
  - version-control
tags:
  - git
  - version-control
  - conventional-commits
draft: false
---

> **Save your time:** I'll talk about the benefits of using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#examples) in a corporate / enterprise scale, continue if you don't know what the heck is this.

## Pre-requisites

- You've played around with `git`.
- You know what is a commit / commit message.

For the fresh people, I owe you an apology (kidding, go study git it's easy). I'd like to keep this post as concise as possible and focused on a specific topic.

## What is the problem?

Commit messages are one of the essential features of a git-based version control systems, providing a historical overview of a project's changes overtime. **However**, poorly structured commits or written commit messages can cause headaches for developers trying to understand past changes, leading to wasted time and effort.

In this article, we’ll explore a better way to write commit messages and why validating a specific format is important.

## Why to keep the commit meaningful?

Five years ago, I worked in a software-house setup where customers or stakeholders would request a feature set packaged as software. At that time, people used TFS, where checking in a file would lock it—preventing any other developer from editing it. You can probably relate to this nightmare.

After several discussions, I finally convinced the team—despite being just a junior developer—to switch to Git. I can't describe the shock on their faces; it was like witnessing humans discover fire for the first time. They were terrified.

So we kept it simple: one branch, and everyone just pushed their changes to it. And that’s when the fun began. I’d wake up after a long night of work only to find that one of my colleagues had overridden my changes with code that didn’t even build (as expected).

And do you know what I found in the commit history?

```text
- Ok
- Ok
- Ok
- Ok
- Ok
.
.
.
- Ok
```

Yes, I felt hopeless—especially since it always seemed to happen on demo days, when I had to quickly recover everything and re-integrate my changes.

But the main question was always: which Ok among all these "Oks" actually caused the issue? Yes, I had to use git bisect. But what if those commits had actually been meaningful and structured to reflect staged changes?

Yes, that was definitely an odd case, and I never blamed my colleague—he was a fresh graduate, and that whole Git thing was completely new to him.

But what about you? Remember that commit that claimed to fix the type of an API response… and then you discovered it actually contained a full restructure of the entire solution file?

That’s just a metaphor :wink:.

I guess you got it already, **It's a Promise!**

## What makes a good commit?

Since this is an opinionated space, I’ve to admit that the type of commits that I like is the one that contains relatively small changes that’s coherent with what the message says.

Yes, we can’t make it perfect all the time and tailored precisely! But if that’s what you think, you’re missing the point!

Hence, these are a few traits I’d categorize a commit’s quality based on:

- **Small commit**, doesn’t contain 99+ changes (my favorite max is when it says 10 files changed). I see people often deliver features in a single commit. That’s not entirely wrong as long as the team is fine with that, but I don’t personally prefer that style. which is why i consider it as a bad practice. makes code reviews hard an annoying!

- **Split the changes**, imagine you're short on time and you've already implemented the task at hand, but suddenly you end up with 30+ changes where some files contain shared scopes of changes. If what you're thinking about is just committing the damn thing, please stop! Luckily, it's 2025 already—most IDEs support partial file staging where you can select specific lines of code to include in a commit. Do split the thing!

- **Write a short meaningful message**, keep reading :heart:.

## What makes a good commit message?

Two years ago i coined this definition of a good commit message, and i still find it valid:

> A Good Commit Message, Is the shortest readable and descriptive message that could provide anyone with all the significant references and information at any time.

**Significant references?** what the heck is that?
In modern agile setup, you'll either use a scrum-framework or a kanban with a board that contains all the tasks. these tasks are mostly a piece of information that describes the objectives, the expected outcomes and the need of that task. whether it's a Jira, Clickup or even a white-board I'll assume you do use something other than verbal phrases that identify these tasks e.g. an ID? That ID is a significant reference.

### Why does it matter?

Significant references are very useful especially when working in a corporate with multiple domain setup where repositories are subject to change by a domain or another. So, to minimize the communication needed when cross code reviews happens between domain, this ID is sufficient to give an entry context about the proposed changes (assuming your team do fill the task with useful information in first place :melting_face:).

{% include figure.liquid loading="eager" path="assets/img/posts/conventional-commits-figure1.drawio.svg" class="img-fluid rounded" zoomable=true %}

Imagine working at VeggieFruity B.V., a company that manages the life cycle of anything planted (including humans, if we ever get there). This corporate beast contains multiple domains, as shown in the diagram. One of their repos is shared across several teams (or domains) and orchestrates different components.

And then one day, the Watermelon Consumers proposed a pull request with the following commit:

```txt
- Changed Everything
```

Yes, I said commits, but it was just one—and that’s what it said. The PR content looked completely gibberish and unrelated.

So, volunteers from affected domains—whose areas of ownership are clearly touched—start asking questions:
What is this? Why is it needed? ... bla bla.

Now, as a normal human who respects their colleagues’ time, I’d look for a clue. I'd check the ticket/issue/task/whatever behind the change to get some context.

But what if there isn’t a single clue?
What if there is one—but it’s just as useless as the commit message?

You have to book a meeting.

Now, booking a meeting isn’t the issue I’m raising—calendars can handle that just fine. The problem is the avoidable waste caused by the lack of clarity. And since meetings require alignment, delays are inevitable.

Now imagine three teams doing this individually.
What if it’s a cross-functional team spread across time zones?

And you know what that delay means?
Yes: pushed deadlines.
Perceived lack of ownership (unless you’re lucky enough to have leads who get it).

It’s basically a butterfly effect.

### Is there a common standard?

Yes, [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#examples) are now widely supported. If you're convinced so far, please consider adopting this approach.

## Validating the chosen format

Now, how to validate that everyone will follow the chosen format? The answer is very simple, use git hooks, specifically **the commit-msg hook**. with regular expressions you can easily throw an error and prevent the commit if it didn't match our criteria.

```sh
#!/bin/sh
# list of Conventional Commits types
cc_types=("feat" "fix")
default_types=("build" "chore" "ci" "docs" "${cc_types[@]}" "perf" "refactor" "revert" "style" "test")
types=( "${cc_types[@]}" )

if [ $# -eq 1 ]; then
    types=( "${default_types[@]}" )
else
    # assume all args but the last are types
    while [ $# -gt 1 ]; do
        types+=( "$1" )
        shift
    done
fi

# the commit message file is the last remaining arg
msg_file="$1"

# join types with | to form regex ORs
r_types="($(IFS='|'; echo "${types[*]}"))"
# optional (scope)
r_scope="(\([[:alnum:] \/-]+\))?"
# optional breaking change indicator and colon delimiter
r_delim='!?:'
r_jira="(WC-[[:digit:]]+) "
# subject line, body, footer
r_subject=" [[:alnum:]].+"
# the full regex pattern
pattern="^$r_jira$r_types$r_scope$r_delim$r_subject"
# Check if commit is conventional commit
if grep -Eq "$pattern" "$msg_file"; then
    exit 0
fi
echo "[Commit message] $( cat "$msg_file" )"
echo "
Your commit message does not follow the standard format
https://www.conventionalcommits.org/
Conventional Commits start with one of the below types, followed by a colon,
followed by the commit message:
    $(IFS=' '; echo "${default_types[*]}")
Example commit message adding a feature:
   WC-1234 feat: added apple seeds payments method
"
exit 1
```
