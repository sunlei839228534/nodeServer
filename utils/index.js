function queryString(param) {
  let obj = {}

  for (i of param) {
    obj[i[0]] = i[1]
  }
  return obj
}

module.exports = {
  queryString
}