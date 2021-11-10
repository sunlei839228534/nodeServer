const http = require('http');
const URL = require('url').URL;
const { queryString } = require('../utils')
const baseMongo = require('./lib/baseMongodb')()

const server = http.createServer(async (req, res) => {
  const myUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = myUrl.pathname;

  paramStr = myUrl
  param = queryString(myUrl.searchParams)

  if ('/v1/userinfos' !== pathname) {
    return setResInfo(res, false, 'path not found', null, 404)
  }
  if (!param.user_ids) {
    return setResInfo(res, false, 'params error')
  }

  console.log(param.user_ids.split(''))
  const userInfo = await queryData({ 'id': { $in: param.user_ids.split('') } });
  return setResInfo(res, true, 'success', userInfo)
})

server.listen(5000, () => {
  console.log(`servre start at 5000`)
})

async function queryData(queryOption) {
  const client = await baseMongo.getClient();
  const collection = client.db('user').collection('test');
  const queryArr = await collection.find(queryOption).toArray();
  return queryArr
}

function setResInfo(res, ret, message, dataInfo, httpStatus = 200) {
  let retInfo = {}
  if (!ret) {
    retInfo = {
      ret: -1,
      message: message || 'success',
      data: dataInfo || {}
    }
  } else {
    retInfo = {
      ret: 0,
      message: message || 'success',
      data: dataInfo || {}
    };
  }
  res.writeHead(httpStatus, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify(retInfo));
  res.end()
  return
}