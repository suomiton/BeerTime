const fetch = require("node-fetch")

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions

  const { baseUrl } = configOptions
  const partition = process.env.GATSBY_PARTITION

  // Create nodes here, generally by downloading data
  // from a remote API.
  const response = await fetch(`${baseUrl}&partition=${partition}`)
  const data = await response.json()

  if (data.length === 0) {
    data.push({ score: 0, timeStamp: "" })
  }

  const toNodeData = (data, id, type) => {
    const content = JSON.stringify(data)
    const nodeData = Object.assign({}, data, {
      id: createNodeId(id),
      parent: null,
      children: [],
      internal: {
        type,
        content,
        contentDigest: createContentDigest(data),
      },
    })
    return nodeData
  }

  const nodeData = toNodeData(
    { scores: data },
    "doodle-scored-entries",
    "DoodleScoredEntries"
  )
  // Process data into nodes.
  createNode(nodeData)
  // We're done, return.
  return
}
