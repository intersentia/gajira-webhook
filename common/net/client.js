const fetch = require('node-fetch')
// const moment = require('moment')

module.exports = serviceName => async (state, apiMethod = 'unknown') => {
  // const startTime = moment.now()

  const response = await fetch(state.req.url, state.req)

  state.res = {
    headers: response.headers.raw(),
    status: response.status,
  }

  // const totalTime = moment.now() - startTime
  // const tags = {
  //   api_method: apiMethod,
  //   method: state.req.method || 'GET',
  //   response_code: response.status,
  //   service: serviceName,
  // }

  state.res.body = await response.text()

  console.log(`got ${state.res.body}`)
  const isJSON = (response.headers.get('content-type') || '').includes('application/json')

  if (isJSON && state.res.body) {
    console.log(`json ${state.res.body}`)
    state.res.body = JSON.parse(state.res.body)
  }

  if (!response.ok) {
    console.log(`error during http call ${response.statusText} ${response.body}`)

    throw new Error(response.statusText)
  }

  return state
}
