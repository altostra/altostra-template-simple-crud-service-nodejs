const { DocumentClient } = require('aws-sdk/clients/dynamodb')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const {
  badRequest,
  notFound,
  success,
  serverError,
  trySanitize,
  methodNotSupported,
} = require('./utils')

const randomBytesAsync = promisify(randomBytes)

const { TABLE_DATA01: TableName, AWS_REGION } = process.env
const db = new DocumentClient({ region: AWS_REGION })

module.exports.handler = async (event) => {
  try {
    switch (event.httpMethod) {
      case 'GET':
        return await handleGetResources(event)

      case 'POST':
        return await handleCreateResource(event)

      case 'PUT':
        return await handleUpdateResource(event)

      default:
        return methodNotSupported()
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`, err)
    return serverError('Operation failed unexpectedly')
  }
}

function trySanitizeResourceId(value) {
  const basic = trySanitize(value)
  return basic && basic.replace(/[^A-z0-9\-_\\s]/gm, '')
}

function toResourceResponse(ddbData) {
  return {
    id: ddbData.pk,
    email: ddbData.email,
    name: ddbData.name
  }
}

async function handleGetResources(event) {
  console.log(`Getting resource(s)`)
  const resourceId = trySanitizeResourceId(event.pathParameters && event.pathParameters.resourceId)
  if (resourceId) {
    const resource = await db.get({
      TableName,
      Key: {
        pk: resourceId,
        sk: resourceId,
      }
    }).promise()

    return resource.Item ? success(toResourceResponse(resource.Item)) : notFound()
  }

  const resources = await db.scan({
    TableName,
    Limit: 50,
  }).promise()

  if (!resources || !resources.Items || resources.Items.length < 1) { return notFound() }
  else return success(resources.Items.map(toResourceResponse))
}

async function handleCreateResource(event) {
  console.log(`Creating resource`)

  let resourceInfo
  try { resourceInfo = JSON.parse(event.body) } catch (err) {
    console.error(`Failed to parse message body`, event.body)
    return badRequest()
  }
  const resourceName = trySanitize(resourceInfo.name)
  const resourceEmail = trySanitize(resourceInfo.email)
  const resourceId = (await randomBytesAsync(16)).toString('hex')

  if (!resourceName || !resourceEmail) { return badRequest() }

  await db.put({
    TableName,
    ConditionExpression: 'attribute_not_exists(pk)',
    Item: {
      pk: resourceId,
      sk: resourceId,
      name: resourceName,
      email: resourceEmail
    }
  }).promise()

  return success()
}

async function handleUpdateResource(event) {
  console.log(`Updating resource`)

  let resourceInfo
  try { resourceInfo = JSON.parse(event.body) } catch (err) {
    console.error(`Failed to parse message body`, event.body)
    return badRequest()
  }
  const resourceName = trySanitize(resourceInfo.name)
  const resourceEmail = trySanitize(resourceInfo.email)
  const resourceId = trySanitizeResourceId(event.pathParameters && event.pathParameters.resourceId)

  if (!resourceId || !resourceName || !resourceEmail) return badRequest()

  try {
    await db.update({
      TableName,
      Key: {
        pk: resourceId,
        sk: resourceId,
      },
      ConditionExpression: '#pk = :pk',
      UpdateExpression: 'set #name = :name, #email = :email',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#name': 'name',
        '#email': 'email',
      },
      ExpressionAttributeValues: {
        ':pk': resourceId,
        ':name': resourceName,
        ':email': resourceEmail,
      }
    }).promise()
  } catch (err) {
    if (err.code === 'ValidationException') {
      console.error(`Resource update in DDB failed validation for existing item`, resourceId, err)
      return notFound()
    }

    console.error(`Resource update in DDB failed unexpectedly`, err)
    return serverError()
  }

  return success()
}
