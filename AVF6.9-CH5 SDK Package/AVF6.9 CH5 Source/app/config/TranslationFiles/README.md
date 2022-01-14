# Translation Files

In this folder are the translation files for AVF.

## Where changes should be made in version control

Do to issue with conflicts, changes to translations should be made on `trunk`.
Changes to translations should not be made on feature branches.
They may be made in a branch if that branch is only used for translation changes and quickly merged in.
If translation items are needed in a feature, after making changes, synchronize with `trunk` by merging `trunk` into the feature branch.

## Adding a translation key

When adding a new translation item, place it below the Translation marker comment (see "Translation marker" below) in `English/en_US_Avf_Fixed_Text.xml`.

## Modifying an English translation value

When making a change to an English translation item's value, move the changed translation item beneath the Translation marker comment (see "Translation marker" below) in `English/en_US_Avf_Fixed_Text.xml`.

## When sending files out for translation

1.  Compress all files in `TranslationFiles` from `trunk`.
2.  In `TranslationFiles/English/en_US_Avf_Fixed_Text.xml` move the Translation marker (see "Translation marker" below) to the bottom of XPath:`/lang`.
3.  Update the date in the Translation marker comment (see "Date format" below) to the same date that the files were compressed.
4.  Commit the move of the Translation marker to `trunk`.
5.  Make a list of keys for any specific values that need to be fixed for languages that were correct in English, but not in other languages.
    The list items should contain the language and translation key.
    Adding context about what was wrong or other details may help in the translation.
6.  Send translations along with list of specific keys that need to be fixed.

## When receiving translated files

1.  Use version control (e.g., Subversion blame) to determine the revision that the Translation marker was last changed (use the date in the marker as a guide).
    - Note: This SHOULD be the revision that was sent out for translation otherwise the merging of the translation files will be confusing.
2.  Branch from `trunk` at that revision to merge in the new translations (this is generally a regular directory merge).
    - Note: I do this by deleting my working copy's TranslationFiles directory, dropping in the new translations as the same folder name, and then revert files that shouldn't have been removed.
3.  Commit the merged changes.
4.  Fix any issues with the received translations and commit.
5.  Subversion Merge `trunk` into your translation branch and fix any issues that occur because of the merge (e.g., any possible conflicts).
6.  Get approval if necessary and then merge the translation branch into `trunk`.

## Translation marker

```xml
    <!-- All Keys below this line are newly added/modified after last translation batch shipped (2020-02-04). They need to be translated to other languages -->
```

## Date format

When adding dates in comments, please use the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date format to avoid ambiguity.
For example the date 11 March 2020 should be formatted as 2020-03-11 (note the leading zeros).
