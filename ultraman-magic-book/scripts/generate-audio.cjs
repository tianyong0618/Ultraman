const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const { ultramanData } = require('../src/data/ultraman.js')

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio')

const voiceMap = {
  name: (item) => item.name,
  desc: (item) => item.desc,
  forms: (item) => item.forms.length > 0 ? item.forms.join('、') : '无多种形态',
  skills: (item) => item.skills.join('、'),
  human: (item) => item.human,
  catchphrase: (item) => item.catchphrase,
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')
}

Object.keys(voiceMap).forEach((key) => {
  const dir = path.join(OUTPUT_DIR, key)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

async function generateAudio(type, item, text) {
  const safeName = sanitizeFilename(item.name)
  const filePath = path.join(OUTPUT_DIR, type, `${safeName}.mp3`)

  const tempFile = path.join(OUTPUT_DIR, type, `${safeName}.txt`)
  fs.writeFileSync(tempFile, text, 'utf8')

  try {
    execSync(
      `edge-tts -f "${tempFile}" --write-media "${filePath}" --voice "zh-CN-XiaoxiaoNeural"`,
      { stdio: 'ignore' }
    )
    fs.unlinkSync(tempFile)
    console.log(`Generated: ${type}/${safeName}.mp3`)
  } catch (e) {
    console.error(`Failed: ${type}/${safeName}.mp3 - ${e.message}`)
  }
}

async function main() {
  console.log(`Generating ${ultramanData.length * 6} audio files...`)

  for (const item of ultramanData) {
    for (const [type, fn] of Object.entries(voiceMap)) {
      const text = fn(item)
      if (text && text !== '待补充' && text !== '无技能数据' && text !== '无') {
        await generateAudio(type, item, text)
      }
    }
  }

  console.log('Done!')
}

main()