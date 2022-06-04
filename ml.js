const MODEL_KEY = 'localstorage://color-classifier'
const { entries } = COLOR_DATA
let model

const normalize = v => v / 255

const loadModel = () => {
  try {
    return tf.loadLayersModel(MODEL_KEY)
  } catch (err) {
    return null
  }
}

const fetchData = () => {
  const colors = entries.map(({ r, g, b }) => ([
    normalize(r), normalize(g), normalize(b)
  ]))

  const labels = entries.map(({ label }) => COLOR_LABELS.indexOf(label))
  const labelsTensor = tf.tensor1d(labels, 'int32')

  const inputs = tf.tensor2d(colors)
  const outputs = tf.oneHot(labelsTensor, COLOR_LABELS.length)

  return { inputs, outputs }
}

const setupModel = () => {
  const model = tf.sequential()

  const hidden = tf.layers.dense({
    units: 16,
    activation: 'sigmoid',
    inputDim: 3
  });

  const output = tf.layers.dense({
    units: 9,
    activation: 'softmax'
  });

  model.add(hidden)
  model.add(output)

  const lr = 0.2
  const optimizer = tf.train.sgd(lr)

  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy'
  })

  return model
}

const trainModel = async () => {
  const { inputs, outputs } = await fetchData()

  const options = {
    epochs: 50,
    validationSplit: 0.1,
    shuffle: true
  }

  await model.fit(inputs, outputs, options)
  await model.save(MODEL_KEY)
}

const predict = (r, g, b) => {
  const input = tf.tensor2d([
    [normalize(r), normalize(g), normalize(b)]
  ])

  const result = model.predict(input)
  const index = result.argMax(1).dataSync()[0]

  return COLOR_LABELS[index]
}

(async () => {

  model = await loadModel()
  
  if (!model) {
    model = setupModel()
    console.log('Training Model')
    await trainModel()
  }

  console.log('Model ready to use')
})()
