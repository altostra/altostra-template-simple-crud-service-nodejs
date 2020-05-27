function success(value) {
  return {
    statusCode: 200,
    body: value && JSON.stringify(value)
  }
}

function notFound() {
  return { statusCode: 404 }
}

function badRequest() {
  return { statusCode: 400 }
}

function serverError(reason) {
  return {
    statusCode: 500,
    body: reason && JSON.stringify(reason)
  }
}

function methodNotSupported() {
  return { statusCode: 405 }
}

function trySanitize(value) {
  try {
    return value && value.toString().slice(0, 36)
  } catch (err) {
    console.error(`Error during value sanitation.`)
    return
  }
}

module.exports = {
  success,
  notFound,
  badRequest,
  serverError,
  trySanitize,
  methodNotSupported,
}