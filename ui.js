const r = document.getElementById('r')
const g = document.getElementById('g')
const b = document.getElementById('b')

const preview = document.getElementById('preview')
const label = document.getElementById('label')

const randomize = () => (
  Math.floor(Math.random() * 255)
)

r.value = randomize()
g.value = randomize()
b.value = randomize()

const handleChange = () => {
  const rVal = r.value
  const gVal = g.value
  const bVal = b.value
  
  const prediction = predict(rVal, gVal, bVal)

  preview.style.background = `rgb(${rVal},${gVal},${bVal})`
  label.innerHTML = `Color: ${prediction}`
}

r.onchange = handleChange
g.onchange = handleChange
b.onchange = handleChange

handleChange()
