// scripts/generate-audio.js
// Generate audio files for Ultraman Magic Book voice feature
// Usage: node scripts/generate-audio.js

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const { ultramanData } = require('../src/data/ultraman.js')

const OUTPUT_DIR = path.join(__dirname, 'public', 'audio')

// 朗读内容映射
const voiceMap = {
  name: (item) => item.name,
  desc: (item) => item.desc,
  forms: (item) => item.forms.length > 0 ? item.forms.join('、') : '无多种形态',
  skills: (item) => item.skills.join('、'),
  human: (item) => item.human,
  catchphrase: (item) => item.catchphrase,
}

// 创建目录
Object.keys(voiceMap).forEach((key) => {
  const dir = path.join(OUTPUT_DIR, key)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// 生成音频
async function generateAudio(type, id, text) {
  const filePath = path.join(OUTPUT_DIR, type, `${id}.mp3`)
  if (fs.existsSync(filePath)) {
    console.log(`Skipped: ${type}/${id}.mp3 (exists)`)
    return
  }

  const tempFile = path.join(OUTPUT_DIR, type, `${id}.txt`)
  fs.writeFileSync(tempFile, text, 'utf8')

  try {
    execSync(
      `edge-tts -f "${tempFile}" --write-media "${filePath}" --voice "zh-CN-XiaoxiaoNeural"`,
      { stdio: 'ignore' }
    )
    fs.unlinkSync(tempFile)
    console.log(`Generated: ${type}/${id}.mp3`)
  } catch (e) {
    console.error(`Failed: ${type}/${id}.mp3 - ${e.message}`)
  }
}

async function main() {
  console.log(`Generating ${ultramanData.length * 6} audio files...`)

  for (const item of ultramanData) {
    for (const [type, fn] of Object.entries(voiceMap)) {
      const text = fn(item)
      // 跳过空数据
      if (text && text !== '待补充' && text !== '无技能数据' && text !== '无') {
        await generateAudio(type, item.id, text)
      }
    }
  }

  console.log('Done!')
}

main()