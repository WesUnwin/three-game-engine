# web site
This folder contains the source code for the react single page app that is publicly hosted
as a github.io web page: (https://wesunwin.github.io/three-game-engine/)

The development and release process is as follows:
- Clone this repo
- npm install (to install all dev dependencies)
- then follow the below steps

# Step 1  Locally Develop/Test Your Changes
Run the following command to locally serve the web site so you can rapidly
develop and test out the web app using webpack dev server:

```
  npm run web_site
```

# Step 2  Compile the app for production
Once you are satisfied with your changes, and ready to go live you must first re-build
docs/website.js, by compiling the javascripts in web_site/ by running:

```
  npm run build_web_site
```

# Step 3  Publish your changes to production (https://wesunwin.github.io/three-game-engine/)
Commit and push all changes to the docs/ folder, this includes the website.js webpack pack
you built during step 2.

Pushing changes to this folder will automatically trigger a github action that when complete
will update https://wesunwin.github.io/three-game-engine.