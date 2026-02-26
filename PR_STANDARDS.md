# Pull Request Standards and Procedures

## Approvers

As a code approver, you are expected to give thorough reivews and thoughtful feedback for all PRs. Below are some tips and expectations:

- **Pay extra close attention to APIs - function params, React component props, interfaces, etc.** The most important thing to get right is the API. Units of code (functions, components) should be focused, should do one and only one thing, and should have logical input parameters and return values. If a function is sloppily-written (maybe it uses a `forEach` loop and `Array.push` rather than `map`) but still has a logical, intuitive API, then at least the poorly-written code will be isolated and won't spread anywhere else. However if a function has a bad API (for example, maybe one of the parameters is `UserProfile` when the function only actually uses the `uuid` property), it doesn't matter how beautifully the code is written; the poor API will spread to other areas of the codebase as other people are forced to write more bad code in order to work around the bad API. So in summary, when reviewing code _always look at the API first_.
- **Merge using "Squash and Merge" and add a meaningful title and description.** When merging code, use the "Squash and Merge" option to combine all commits into one. Also make sure to modify the title so that it serves as an appropriate summary of the commit (leave the PR number at the end as well), and either clear the description text box or add a more detailed description of the change. The commit title and description will appear in the commit log as well as in changelogs, so it is important that they are useful.

  For example, here is what the commit might look like before the merge:

  ![image](./documentation/images/pr_standards/squash_and_merge_pre.png)

  And here is what it looks like after updating the title and description:

  ![image](./documentation/images/pr_standards/squash_and_merge_post.png)

- **Use the "Request Changes" functionality** If you leave a comment that you feel must be addressed before the PR can be merged, use the "Request Changes" option when submitting your review. Additionally, make sure to change your review to "Approved" in a timely manner once those changes are addressed.
