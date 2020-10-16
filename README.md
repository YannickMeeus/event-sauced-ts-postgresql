# Event-Sauced - PostgreSQL Engine

Welcome to the PostgreSQL engine for [Event-Sauced](https://github.com/YannickMeeus/event-sauced-ts).
As this is a component library, I would recommend readers to go check out the main library for
an overview of what Event Sauced is meant to be.

## Motivation

I like learning about databases, what they can - and more importantly - what they can not do.
This lead me to try and implement an opinionated, but quite thin - event sourcing framework
on top of the world's more popular databases.

And one of those seems to be PostgreSQL, so let's get started!

## Build status - Github Actions

[![Build Status](https://github.com/YannickMeeus/event-sauced-ts-postgresql/workflows/Verify%20(Build%20&%20Test),%20Package%20and%20Deploy%20if%20applicable/badge.svg)](https://github.com/YannickMeeus/event-sauced-ts-postgresql/actions)

I'm currently orchestrating everything using [Github Actions](https://github.com/YannickMeeus/event-sauced-ts-postgresql/actions).
It is fun, there's a bunch of goodies to be had for free, and it keeps stuff well within GitHub.

## Code style

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

I'm using a combination of [Prettier](https://prettier.io/), [Husky](https://github.com/typicode/husky),
[Lint-Staged](https://github.com/okonet/lint-staged) and finally [ESLINT].

It's a set-up that I'm borrowing from [Alex Jover](https://github.com/alexjoverm)'s amazing
[Typescript Library Starter](https://github.com/alexjoverm/typescript-library-starter), and it's working a treat.

There are two levels of linting happening, _Code Style_ and _Static Analysis_.
The former will be applied as a Git pre-commit hook (courtesy of Husky) on only staged files for speed (courtesy of Lint-Staged),
and will automatically format the code (courtesy of Prettier).

The latter linter step - making use of more in-depth static analysis information - will be triggered as part of a Git pre-push hook, as it's generally a more expensive operation, and I don't want to be
bothered _all_ the time, as long as I get bothered before I actually push to my remotes.

You can find more on this in `package.json`.

## Dependencies - Runtime & Otherwise

[![Dependencies](https://david-dm.org/yannickmeeus/event-sauced-ts-postgresql.svg)](https://david-dm.org/yannickmeeus/event-sauced-ts-postgresql)
[![DevDependencies](https://david-dm.org/yannickmeeus/event-sauced-ts-postgresql/dev-status.svg)](https://david-dm.org/yannickmeeus/event-sauced-ts-postgresql)

### Dependency Philosophy

I like to keep the run-time dependency **count** to a bare minimum. This means that - in this case - I'll be fighting tooth and nail to keep the
runtime dependencies to **2**:

1. the core [event-sauced](https://github.com/YannickMeeus/event-sauced-ts) library
2. [pg](https://node-postgres.com/) - Incredibly stable PostgreSQL library for Node.js

### Versioning

Dependency versioning is managed in two ways:

1. Automated - via [Renovate](https://renovate.whitesourcesoftware.com/)
2. Manual - `npm start maintenance.update_dependencies.interactive` - This will run `npm-check-updates` and guide you through an update.

You can perform a maintenance dry-run using just `npm start maintenance`.

## Frameworks/Tech Used

- Node.js
- [Typescript](https://www.typescriptlang.org/) - Type all the things
- [Rollup](https://rollupjs.org/) - Package all the things
- [Jest](https://jestjs.io/) - Test all the things
- [Wallaby](https://wallabyjs.com/) - Test all the things RIGHT NOW
- [Visual Studio Code](https://code.visualstudio.com/) - Write..all the things??

That's probably it for now.

## Code Example

@TODO - Fill this in once there's some code to examplify.

## Installation

@TODO - Fill this in once there's some package to install.

## Tests

@TODO - Fill this in (there's a pattern here, it's subtle though) once there's something to test.

## Contribute

@TODO - Set up contributers agreement

## Credits

@TODO - Fill this in once you remember who all to thank

## License

![GitHub](https://img.shields.io/github/license/yannickmeeus/event-sauced-ts-postgresql.svg?logoColor=brightgreen&style=flat-square)

copyright © 2017-2019 YannickMeeus
