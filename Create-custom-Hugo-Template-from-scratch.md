# Create custom Hugo Template from scratch

Create a directory structure for your new website: hugo new site <your directory's name>

Edit the newly generated configuration file:
languageCode: "en-us"
title: "Your site's name"

Refer to the [official documentation](https://gohugo.io/getting-started/directory-structure/) for more information about the default directory structure
When Hugo runs it creates a resources directory which isn't covered in the official documentation. It is a resource cache where generated files, such as images, are stored.
To make use of Hugo's asset processing features a top level assets directory needs to exist
The remaining files for your site that won't be processed by Hugo should go in the static directory
More information about asset management:
https://gohugo.io/hugo-pipes/introduction/
https://gohugo.io/hugo-pipes/minification/
https://gohugo.io/hugo-pipes/fingerprint/

Create a new assets directory and copy your style sheet to that location:
mkdir -p assets/css
cp ~/path/to/your/style.css assets/css/

To minify and fingerprint our style.css use the following lines in your template
{{ $style := resources.Get "css/style.css" | minify | fingerprint }}
<link rel="stylesheet" href="{{ $style.Permalink }}">

Remove any unneeded directories and create three new ones:
rm -rf archetypes data themes
mkdir -p layouts{_default,partials,shortcodes}

Start the Hugo server: hugo server
Visit http://localhost:1313/ Any changes made in your project directory will be reflected in your browser


Place any JavaScript, images, and any other non-CSS assets in the static directory
In your layouts/partials/ directory create templates that will be commonly used by other pages, for example, header.html and footer.html These will be referenced by other files using the partial keyword
Create a layouts/_default/baseof.html template that contains general markup that will be used by every page
Create a layouts/_default/list.html template which will be used by every section's index page in your site
Create a layouts/index.html template that will be used by the home page
Optionally create additional subdirectories in the layouts directory for any other section pages
Once the layout templates are in place you can start adding markdown files in your content directory which will make up the majority of site maintenance work
It would be ideal if the majority of user managed content is authored solely using markdown with a minimal amount of shortcodes. One way of accomplishing this is by splitting up markdown files in the content directory, including a type property in the front matter, and then referencing that type property in layout templates where most of the markup can live.

Some common gothas
```
{{< highlight html >}} - unexpected “<” in command Built site for language
```

SHort answer: You can only the shortcodes inside the content directory.
You should use partials if you want to use in your theme files.

Solution #2:
```
{{ highlight `<div class="row">
<div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
  <div class="header">` "html" "" }}
```

Solution #2:
Use partials
```
{{ $a := partial "footer" . }}
{{ highlight $a "html" "" }}
```