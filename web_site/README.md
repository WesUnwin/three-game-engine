# web site

This contains all the code to build docs/website.js which is used by docs/index.html.
Everything in the docs folder (upon pushing a commit) is published by a github action to: https://wesunwin.github.io/three-game-engine/

To update docs/website.js run:
```
  npm run build_web_site
```

Then commit and push the changes to the docs/ folder,
then wait a few minutes for the github action that updates the github.io website to complete.

To run locally for development purposes use:
```
  npm run web_site
```