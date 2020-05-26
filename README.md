# A template for Altostra's project templates 

> WE HAVE TO GO DEEPER

When initializing new repository from this one, You must do the following:

* Edit `.altostra/template.json` as described:
  * Set the `name` field to an actual meaningful name.
  * Set the `description` field with a good description of what 
this project-template is.
  * Place a single valid *blueprint* in the `blueprints` array
  * Optionally, add *glob* patterns to the `includes` and/or `excludes` arrays.  
**Please note** the relevant section reagarding `template.json` glob patterns.
* Add whatever additional files you'd like.  
Don't forget to update the `includes`/`excludes` field in your `template.json` 
accordingly.
* Edit the `README.md` file - so it would descrive **your** template.

### `template.json` glob patterns

You must use only globs for files (not directories)  
If you wish to include/exclude all files in a directory, use *star pattern* `**`
* **BAD** glob pattern: `/files-dir`
* **GOOD** glob pattern: `/files-dir/**`


