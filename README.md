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
⟹ Provide a video highlighing your Hackathon module submission and provide a link to the video. You can use any video hosting, file share or even upload the video to this repository. _Just remember to update the link below_

⟹ [Replace this Video link](#video-link)

## Pre-requisites and Dependencies

- SitecoreAI
- Administrator access to SitecoreAI Cloud Portal for app registration and configuration

## Installation instructions

### Build and run Locally

1. Clone the repository
1. Open terminal
1. Navigate to the `./src/ide/` folder
1. Run `npm install` to install the dependencies
1. Run `npm run build` to build the module
1. Run `npm run start` to create run Sitecore Marketplace module
1. Access the module at `http://localhost:3000` in your browser. You should be redirected to documentation page if the module is running correctly.
1. Alternatively, this module is hosted on Netlify and can be accessed at [https://sitecore-hackathon-2026.netlify.app/](https://sitecore-hackathon-2026.netlify.app/)

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
1. Set *Deployment URL* to `http://localhost:3000`. Or `https://sitecore-hackathon-2026.netlify.app/` if you do not want to run it locally.
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

![Apps icon](/docs/images/apps-icon.png)
![Apps list](/docs/images/apps-list.png)

During the first run, application will create few items in Sitecore content. Please be patient. Once the items are created, you will see the application itself.
![Application](/docs/images/application.png)

### Configuration

"Sitecore JavaScript Extensions" does not require any additional configuration.

## Usage instructions
⟹ Provide documentation about your module, how do the users use your module, where are things located, what do the icons mean, are there any secret shortcuts etc.

Include screenshots where necessary. You can add images to the `./images` folder and then link to them from your documentation:

![Hackathon Logo](docs/images/hackathon.png?raw=true "Hackathon Logo")

You can embed images of different formats too:

![Deal With It](docs/images/deal-with-it.gif?raw=true "Deal With It")

And you can embed external images too:

![Random](https://thiscatdoesnotexist.com/)

## Comments
If you'd like to make additional comments that is important for your module entry.
