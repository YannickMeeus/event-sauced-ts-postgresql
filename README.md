
[![Greenkeeper badge](https://badges.greenkeeper.io/YannickMeeus/event-sauced-ts-postgresql.svg)](https://greenkeeper.io/)

# Event-Sauced - PostgreSQL Engine

Welcome to the PostgreSQL engine for [Event-Sauced](https://github.com/YannickMeeus/event-sauced-ts).
As this is a component library, I would recommend readers to go check out the main library for
and overview of what Event Sauced is meant to be.

## Motivation

I like learning about databases, what they can - and more importantly - what they can not do.
This lead me to try and implement an opinionated, but quite thin - event sourcing framework
on top of the world's more popular databases.

And one of those seems to be PostgreSQL, so let's get started!

## Build status - CircleCI

![CircleCI](https://img.shields.io/circleci/build/github/YannickMeeus/event-sauced-ts-postgresql.svg?style=for-the-badge)

I'm currently orchestrating everything using [CircleCI](https://circleci.com/gh/YannickMeeus/event-sauced-ts-postgresql),
with a plan to move to GitHub actions when it either comes out of public beta or I enter (🙏) into the public beta.

## Code style

I'm using a combination of [Prettier](https://prettier.io/), [Husky](https://github.com/typicode/husky),
[Lint-Staged](https://github.com/okonet/lint-staged) and finally [TSLint](https://palantir.github.io/tslint/).

It's a set-up that I'm borrowing from [Alex Jover](https://github.com/alexjoverm)'s amazing
[Typescript Library Starter](https://github.com/alexjoverm/typescript-library-starter), and it's working a treat.

There are two levels of linting happening, _Code Style_ and _Static Analysis_.
The former will be done as a Git pre-commit hook (courtesy of Husky) on only staged files for speed (courtesy of Lint-Staged),
and will automatically format the code (courtesy of Prettier).

The actual Static Analysis will be triggered as part of a Git pre-push hook, as it's generally a more expensive operation, and I don't want to be
bothered _all_ the time, as long as I get bothered before I actually push to my remotes.

You can find more on this in `package.json`.

## Runtime Dependencies

## Frameworks

## Code Example

## Installation

## Tests

## Contribute

## Credits

## License
