# Simple CRUD Service Template

Use this template to create a simple CRUD service with an API, a function and a table.
You can then change and extend it to fit your requirements.

## Getting started

## Things you'll need for this tutorial
1. An Altostra Account (Don't have one yet? Just [login](https://app.altostra.com) here)
1. Altostra CLI installed (`npm i -g @altostra/cli` or [see docs](../reference/CLI/altostra-cli.html#installation))
1. Altostra Tools extension for Visual Studio Code ([VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=Altostra.altostra) or [see docs](../getting-started/installation.html#install-the-visual-studio-code-extension))
1. A connected AWS cloud account ( [Web Console settings](https://app.altostra.com/settings)  or [see docs](../getting-started/connect-your-accounts.html#connect-your-cloud-service-accounts))
1. An Environment connected to your AWS Account ([Web Console environments](https://app.altostra.com/environments) or [see docs](../howto/envs/manage-environments.html)) - We'll call it `Dev` for berevity, but you can pick any of your environments

To debug your function you'll also need to install SAM-CLI by following
[its installation instructions](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).


## Using the template

You have several options to get started with this template.  
Either go to the Altostra Web Console and create a new project.  
When asked to use a template, select "static-website".

Alternatively, you can use the Altostra CLI to initialize a new project from the template by running:
```sh
$ alto init --template static-website
```

You can also apply the template to an existing Altostra project from Visual Studio Code by going
to the Altostra view in the main toolbar and clickign on "static-website" in the templates list.

### Project deployment

Run the following commands to create a deployment image of the project and deploy it as a new instance.

For more information on each command refer to the [Altostra CLI docs](https://docs.altostra.com/reference/CLI/altostra-cli.html).

1. Create an
[image](https://docs.altostra.com/howto/projects/deploy-project.html#create-a-project-image)
from the project:
```shell
$ altos push v1.0
```
2. Deploy the image to a new deployment named `main` in the `Dev` environment:
```shell
$ alto deploy main:v1.0 --new Dev
```
3. Manage the project in the Altostra Web Console:
```shell
$ alto console
```

> To update an existing deployment with new images just omit the `--new` flag and environment name:
> ```shell
> $ alto deploy main:v2.0
>```

## Content
* A REST-API
* Handler Function
* Data Table

## Source Files
The sources are located in the `functions` directory.

## Running and debugging

To run the function locally you'll have to create a dynamo-db table by deploying the project, then:
- Run `alto console`
- Select the deployment
- Click on the `Open in AWS Console` button of the latest version
- Go to the `Resources` tab
- Filter to `Table01` and click on the *Logical ID* of the table Resource
- Copy its *Table name*

For brevity, we assume it is called `Table01-1`.

### *Nix

#### Running
To run a local HTTP API that invokes the functin for the appropriate HTTP calls run
```shell
TABLE_DATA01="Table01-1" sam local start-api -t sam-template.json
```

#### Debugging
To debug the function we can run
```shell
TABLE_DATA01="Table01-1" sam local start-api -t sam-template.json -d 5000
```
After every call to the API, the function would load then wait until a debugger
would connect to `localhost:5000`.


### Windows PowerShell 

#### Running
To run a local HTTP API that invokes the functin for the appropriate HTTP calls run
```shell
$ENV:TABLE_DATA01="Table01-1" 
sam local start-api -t sam-template.json -d 5000
```

#### Debugging
To debug the function we can run
```shell
$ENV:TABLE_DATA01="Table01-1" 
sam local start-api -t sam-template.json
```
After every call to the API, the function would load then wait until a debugger
would connect to `localhost:5000`.

### Windows CMD

#### Running
To run a local HTTP API that invokes the functin for the appropriate HTTP calls run
```shell
SET "TABLE_DATA01=Table01-1" 
sam local start-api -t sam-template.json
```

#### Debugging
To debug the function we can run
```shell
SET "TABLE_DATA01=Table01-1" 
sam local start-api -t sam-template.json -d 5000
```
After every call to the API, the function would load then wait until a debugger
would connect to `localhost:5000`.
