![Hackathon Logo](docs/images/hackathon.png?raw=true "Hackathon Logo")
# Sitecore Hackathon 2026

## Team name
Ererenderingdering

## Category
Best Marketplace App for Sitecore AI - Build something publishable. Not just a demo.

## Description

We see that SitecoreAI is quickly moving to the future. We are not sure what will be with our favorite Sitecore tools, like Content Editor or Sitecore Powershell Extenstions. They rely on .Net Framework and the future for them is uncertain.

That is why I decided to take [Sitecore Powershell Extensions](https://doc.sitecorepowershell.com/) and reimagine it. How it would look if it was built with modern technologies, like React and TypeScript? How it would look if we write our scripts in JavaScript instead of PowerShell? And most importantly, how it would look if it was built as a SitecoreAI module and running in the cloud?

Welcome to the "Sitecore JavaScript Extensions" - a SitecoreAI module that brings the power of scripting to Sitecore content authors and administrators. With this module, you can write and execute JavaScript code to automate tasks, manipulate content, and extend Sitecore functionality in any way you want.

## Video link

[Youtube](https://www.youtube.com/watch?v=zqOo7-eLTYU)

## Pre-requisites and Dependencies

- SitecoreAI
- Administrator access to SitecoreAI Cloud Portal for app registration and configuration
- Node.js 24 or higher for local development and testing

## Installation instructions

### Build and run Locally

1. Clone the repository
1. Open terminal
1. Navigate to the `./src/ide/` folder
1. Run `npm install` to install the dependencies
1. Run `npm run build` to build the module
1. Run `npm run start` to create run Sitecore Marketplace module
1. Access the module at `http://localhost:3000` in your browser. You should be redirected to documentation page if the module is running correctly.
1. Alternatively, this module is hosted on Netlify and can be accessed at [https://sitecore-javascript-extensions.netlify.app/](https://sitecore-javascript-extensions.netlify.app/)

### Register a "Sitecore JavaScript Extensions" app in SitecoreAI

1. Log in to the [Cloud Portal](https://portal.sitecorecloud.io/).
1. On the navigation header, click App studio > Studio > Create app.
1. In the Create app modal, in the App name field, enter "Sitecore JavaScript Extensions"
1. Select Custom as the type of your app.
1. Click Create. A new app is registered and ready to be configured.

### Configure and activate "Sitecore JavaScript Extensions" app

1. Enable "Standalone" and "Full screen" extension points for the app.
1. Enable *SitecoreAI APIs* and *AI skills APIs* API access
1. Permissions *Pop-ups*, *Copy to clipboard*, and *Read from clipboard* are not required. But you will be able to write and execute your own custom JavaScript code. If you want to use any of these permissions, enable them as well.
1. Set *Deployment URL* to `http://localhost:3000`. Or `https://sitecore-javascript-extensions.netlify.app/` if you do not want to run it locally.
1. Set *App logo* to `/docs/images/logo.png`
1. Click *Activate* to activate the app.

### Install an activate "Sitecore JavaScript Extensions"

1. In the [Cloud Portal](https://portal.sitecorecloud.io/), click My apps.
1. Find "Sitecore JavaScript Extensions" in the list of your apps and click *Install*.
1. Select apps, where you want to install "Sitecore JavaScript Extensions".
1. Click *Next*
1. Review the permissions and click *Install* to install the app.

### Start "Sitecore JavaScript Extensions"

You can open "Sitecore JavaScript Extensions" from the list of your apps in the Cloud Portal.

During the first run, application will create few items in Sitecore content. Please be patient. Once the items are created, you will see the application itself.
![Application](/docs/images/application.png)

### Configuration

"Sitecore JavaScript Extensions" does not require any additional configuration.

## Usage instructions

### Open App

Application is available in the list of your apps in the Cloud Portal. Click on the app to open it.
![Apps icon](/docs/images/apps-icon.png)
![Apps list](/docs/images/apps-list.png)

### Editing code

"Sitecore JavaScript Extensions" allows you to write and execute JavaScript code. It is based on the popular Monaco Editor, which provides rich editing experience with syntax highlighting, code completion, and error checking.

![Code](/docs/images/code.png)

### API

The general rule is that all functions that make request to Sitecore starts with `Sitecore.<>`. There is aliase for better discoverability `sc.<>`. Also, all functions are groped by the domain, for example `Sitecore.Content.<>` contains functions for working with Sitecore content items, `Sitecore.Publication.<>` contains functions for publication operations.

The code is executed in the browser context. That means that you can use any browser API in your code. For example, you can use `fetch` to make HTTP requests, `localStorage` to store data locally, and so on. You can also use any JavaScript library that is available in the browser context. 

There are also helper functions that allow you show results of the execution in the console or as a rendered HTML. These functions are prefixed with `print...()` and `render...()`, for example `printItem()`, `print()`, `renderItem()`, `render()`, etc.

### Running code

To run your code, simply click the "Run" button. The code will be executed in the context of SitecoreAI, which means you can use SitecoreAI APIs to interact with Sitecore content.
![Run Code](/docs/images/run-code.png)

### Results

The code execution results will be displayed at the bottom of the screen. There are two tabs: Console and Results. The console tab shows plain text which is rendered by `print...()` helpers. The Results tab shows HTML, which is rendered by `render...()` helpers. You can switch between the tabs to see different types of results.

![Console](/docs/images/console.png)
![Results](/docs/images/results.png)

### Saving and loading code

It is possible to save your code as a snippet and load it later. Saved snippets will be stored in Sitecore Content as items.
![Save Code](/docs/images/save-code.png)

It is possible to load any of the saved snippets and run it. It is also possible to load the snippet from the library of examples.

![Load Code](/docs/images/load-code.png)

### Help and documentation

The help is autogenerated from available functions and their JSDoc comments. It was done to make sure that the documentation is always up to date with the code. You can access the help by clicking the "Help" button.

![Help button](/docs/images/help-button.png)

Help sections are grouped by the domain, for example "Content" section contains functions for working with Sitecore content items, "Templates" section contains functions for operations with Sitecore templates.

You can use search to find the function you need. 
![Help search](/docs/images/help-search.png)

## Comments

That was unusual Hackathon experience for me. It is for the first time when I wrote so small amount of code by myself and delivered huge value. AI changes everything and now it is possible to recreate something like Sitecore Powershell Extensions in one day. The future is bright and frightening at the same time. I am looking forward to see what will be next.
