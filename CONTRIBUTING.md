# Contributing

This document contains information on contributing to the repository.

## Getting Access

To contribute to the repository, follow one of the strategies below:

### Fork the repo and open PRs back to the upstream

The advantage of the forking approach is that you can do it right now! You don't need to request any access; just [fork the repo in GitHub](https://docs.github.com/en/get-started/quickstart/fork-a-repo), make your changes and open a PR back into the upstream repo.

**Note:** When following this approach, it is best to make your changes on a feature branch in your forked repo. This way, if you need to update your forked main branch, you don't have to worry about conflicts with your work-in-progress; your main branch will always be ready to sync with the upstream main branch.

### Become a contributor

Forking the repository is a good option if you don't anticipate making many contributions, or if you are waiting for your access approval. However, if you will be a frequent contributor, it is best to request access to the repository. This will allow you to clone the actual repository and push branches to the remote, saving you the hassle of constantly needing to sync your forked repo with the upstream.

## Contributing Code

All code in the repository goes through a strict code review process. This is not just a formality, or a rubber-stamping process; reviewers will thoroughly review each pull request and offer thoughtful feedback. It is perfectly normal for a PR to have several comments, or to go through multiple reviews before it is merged.

## Branching Strategy

This repository uses a trunk based branching strategy. Checkout feature branches from and PRs back into the `main` branch.  All commits into main must be made by a PR and have at least one approver.  Allow all PR quality checks to pass before merging.  Only use the Squash merge strategy to keep the history in main clean and concise.  Where possible PRs should reference an open issue and be included in a release.  Github Actions will take care of version bumps, release branches, and publishing to Artifactory for you so no manual deployments should be necessary.

### Branch Naming Conventions

Use a branch name that matches the following patterns:

- `main` for daily development
- `feature/***` for feature development
- `bugfix/***` for fixing defects
- `chore/***` for updating documentation, bumping version numbers, or vulnerability updates
- `rel_****_**` for releases but these are automaticaly created by the CI pipeline

### Code review overview

When a PR is opened, potential reviewers will be notified via email (anyone can subscribe to these notifications by "watching" the repo in GitHub). Generally someone will review the PR and either leave comments or merge the code that same day, however if the PR is opened later in the day it might not be reviewed until the following day.

### Who are the reviewers?

Generally the team reviews PRs, however anyone can do it! It is highly encouraged for anyone to leave feedback on any open PR.

### Requesting a re-review

If comments are left on the PR, the reviewer may add a "pending review updates" label. Once you make the necessary changes, you can remove this label and add a "ready for re-review" label to indicate to the reviewers that you have made the requested changes.

### Stacking PRs

Sometimes a PR might take a long time to get merged, perhaps because it was very large, or there was lots of feedback, or due to long feedback cycles from timezone differences. To prevent these PRs from blocking other work that might depend on the PR, you can create a new branch off of the PR branch. This allows you to keep adding new code on top of the pending PR code. However, be aware that as changes are made to the PR, you will have to merge them into your branch and there may be conflicts.

If you follow this strategy and need to create a PR for your new branch before the base PR is merged, you can create the PR as normal and mention in the description that it depends on another (for example, say "Depends on #1656). This is known as "stacking PRs".

### Follow-up PRs

Ideally a PR won't be merged until all feedback has been incorporated. However for non-critical feedback, it is acceptable to create a follow-up PR. In this case, the reviewer will create a GitHub issue describing the change that needs to be made and will assign the issue to the developer who opened the PR. Once the feedback has been addressed in a follow-up PR, the GitHub issue can be closed.

### Test Driven Development

When making an update, it is best to update the tests first to reflect the kind of change that you would like to see.  Make a pull request into the main branch and the tests should fail.  If approvals are required then have a conversation with stakeholders to verify that the changes made to the tests are the right approach and record that in the comments.  Next go ahead and make changes to the code so that the tests will pass.  Now we can have a high level of confidence that the changes we made are producing the outcome we expect.

If there are no tests for the scenario you are working on then your first task should be to add tests that reflect the current outcome, get that merged, and then continue your work as described above.

### Best practices

- **Keep PRs small**. Ideally 10 files or less. Any larger than that, and a reviewer may request that you find a way to break it into smaller pieces.
- **Keep PRs focused**. There's no such thing as too small of a PR. A PR does not have to fulfill all of the acceptance criteria of an issue; it might take multiple PRs before a Rally story would be considered complete. Create PRs early and often!
- **Add a description of your change.** State what the objective of the PR is, and what the previous functionality was vs. the new functionality. If relevant, include a link to the UI designs (such as Invision).
- **Use the "review only" label if you simply want feedback.** If you are not finished with your code yet, but you want some initial feedback, use the "review only" label when you open your PR.
- **Avoid sending private messages or emails about PRs.** As much as possible, keep conversations in the PR itself. This keeps all conversation in one place and visible to everyone, and prevents reviewers from being overwhelmed with messages and emails.
- **Fix PR feedback on the same branch and PR.** Don't close the PR and fix the comments in a different one, because then the reviewer has to dig up the old PR to see what the comments were.
- **Don't reuse the same branch for multiple PRs.** Once a PR is merged, delete the local branch, update your local master branch, and create a new branch from master to start your next PR. This ensures that you are always working off of the latest code, and makes it easier for reviewers to see your new commits in a PR.
- **Don't push new, unrelated code to PRs that have already been opened.** For example, if you open a PR that contains a React component and you receive feedback, don't say "I made the changes that you suggested and I also pushed a new component which depends on the first one". Consider creating a stacked PR instead.
- **If you are going to make large or significant changes, discuss with someone on Invincibles first.** If you make a large, radical change or introduce a large new feature, your code will probably not be merged.

## Code Quality Checks

There are a handful of checks that must pass before a PR can be merged. These checks will automatically be executed when a PR is created. While the checks are in progress, there will be a yellow dot next to the commit; when the checks pass, the dot will turn green; and if the checks fail, the dot will turn red. You can click on the "Details" link to view the job and see what failed, if anything.

Be sure that Husky is running on your local machine when you are commiting code so that commits are clean and don't include errors that could be caught by linting, prettier, and unit testing.

All work should include tests to verify that the work is accurate and requirements are being met.  An average coverage of above 80% is the target.

### Releases and Builds

All version bumps of packages are handled automatically.  There is no need for a version number to be modified by a developer through a PR.

#### Prereleases

During a sprint there will be many PRs merged into the main branch.  Each time a PR is merged into the main branch, Github Actions will run a prerelease script which scans the diff for changes to files in packages and then bumps the version number of those packages. Each package has `preversion` and `postversion` commands which are triggered when the version changes.  The preversion command is usually used to build the package and the postversion command is used to prepare the package for deployment and distribution.

#### Release Candidates

Once work is done in a sprint and we need to release a candidate to production or to a higher environment we use the Major Release, Minor Release, or Mixed Release workflows to do that.  These workflows will scan the main branch for packages that are prereleases (they have -next. in the version number) and bump them to remove the "next" tag.  At the same time they create a release branch and push the updates to both main and the release branch.  There is no need to create the release branch yourself.  The workflow will take care of that for you.

The Mixed Release workflow allows you to pass in a JSON object representing which packages to bump to minor and which to bump to major versions.  You can get that JSON value by running `yarn release` in your main branch and it will walk you through questions asking which option to select for each package.  Copy and paste that JSON into the input in the mixed release workflow and it will trigger correctly.

#### Hotfixes

If a defect is found in a release then you need to open a PR into the release branch that is effected with the fix.  That will trigger the Hotfix workflow which will bump the patch version numbers and deploy or publish the packages that are changed.

### Publishing and Deployment
Github Actions allows us to break up a complex build pattern into smaller reusable chunks that are chained together.  When one workflow completes it can trigger the next one.  Any files that need to be passed between the workflows are uploaded into Github as artifacts.  This concept allows us to separate the steps required to build the packages from how to deploy them.  Currently we have actions that allow you to publish a package to a container registry, an Azure storage blob and CDN, an Azure function, and to Artifactory.  You'll find workflows for each of these that are triggered by the completion of a release workflow.
