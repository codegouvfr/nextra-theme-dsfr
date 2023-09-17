<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/80216211-00ef5280-863e-11ea-81de-59f3a3d4b8e4.png">  
</p>
<p align="center">
    <i>DSFR theme for Nextra</i>
    <br>
    <br>
    <a href="https://github.com/codegouvfr/nextra-theme-dsfr/actions">
      <img src="https://github.com/codegouvfr/nextra-theme-dsfr/workflows/ci/badge.svg?branch=main">
    </a>
    <a href="https://bundlephobia.com/package/nextra-theme-dsfr">
      <img src="https://img.shields.io/bundlephobia/minzip/nextra-theme-dsfr">
    </a>
    <a href="https://www.npmjs.com/package/nextra-theme-dsfr">
      <img src="https://img.shields.io/npm/dw/nextra-theme-dsfr">
    </a>
    <a href="https://github.com/codegouvfr/nextra-theme-dsfr/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/nextra-theme-dsfr">
    </a>
</p>
<p align="center">
  <a href="https://github.com/garronej/nextra-dsfr-demo">Demo repo</a>
  -
  <a href="https://nextra.react-dsfr.fr">Show me what it looks like</a>
</p>

# Install / Import

```bash
$ yarn add @codegouvfr/nextra-theme-dsfr @codegouvfr/react-dsfr @mui/material @emotion/styled @emotion/react @emotion/server
```

# Contributing

## Starting the demo app in dev mode

```bash
cd ~/github
git clone https://github.com/garronej/nextra-theme-dsfr
cd nextra-theme-dsfr
yarn dev
```

Then in another terminal.

```bash
cd ~/github/nextra-dsfr-demo
yarn start
```

Now you can do changes both in `~/github/nextra-theme-dsfr` and `~/github/nextra-dsfr/demo`.  
You will see the change live in the app.

> NOTE: Each time you changes any dependencies you must restart `yarn dev` and `yarn start`.

## Testing your changes in an external app

You have made some changes to the code and you want to test them
in your app before submitting a pull request?

```bash
cd ~/github
git clone https://github.com/garronej/nextra-dsfr-demo
cd nextra-dsfr-demo
yarn

cd ~/github
git clone https://github.com/codegouvfr/nextra-theme-dsfr
cd nextra-theme-dsfr
yarn
yarn build
yarn link-in-app nextra-dsfr-demo
npx tsc -w

# Open another terminal

cd ~/github/nextra-dsfr-demo
rm -rf node_modules/.cache
yarn dev # Or whatever my-app is using for starting the project
```

You don't have to use `~/github` as a reference path. Just make sure `nextra-dsfr-demo` and `nextra-theme-dsfr`
are in the same directory.

## Releasing

For releasing a new version on GitHub and NPM you don't need to create a tag.  
Just update the `package.json` version number and push.

For publishing a release candidate update your `package.json` with `1.3.4-rc.0` (`.1`, `.2`, ...).  
It also works if you do it from a branch that has an open PR on `main`.

> Make sure you have defined the `NPM_TOKEN` repository secret or NPM publishing will fail.

## Maintainers

-   [Joseph Garrone](https://github.com/garronej)
-   [Dylan DECRULLE](https://github.com/ddecrulle) - Insee
-   [Dimitri POSTOLOV](https://github.com/B2o5T) - Main [Nextra](https://nextra.site) maintainer
