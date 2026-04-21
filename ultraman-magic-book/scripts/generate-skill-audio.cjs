const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const { ultramanData } = require('../src/data/ultraman.js')

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'skills')

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

async function generateAudio(ultramanName, skillName, text) {
  const safeUltramanName = sanitizeFilename(ultramanName)
  const safeSkillName = sanitizeFilename(skillName)
  const filePath = path.join(OUTPUT_DIR, `${safeUltramanName}_${safeSkillName}.mp3`)

  if (fs.existsSync(filePath)) {
    console.log(`Skipped: ${safeUltramanName}_${safeSkillName}.mp3 (exists)`)
    return
  }

  ensureDir(OUTPUT_DIR)

  const tempFile = path.join(OUTPUT_DIR, `${safeUltramanName}_${safeSkillName}.txt`)
  fs.writeFileSync(tempFile, text, 'utf8')

  try {
    execSync(
      `edge-tts -f "${tempFile}" --write-media "${filePath}" --voice "zh-CN-XiaoxiaoNeural"`,
      { stdio: 'ignore' }
    )
    fs.unlinkSync(tempFile)
    console.log(`Generated: ${safeUltramanName}_${safeSkillName}.mp3`)
  } catch (e) {
    console.error(`Failed: ${safeUltramanName}_${safeSkillName}.mp3 - ${e.message}`)
  }
}

async function main() {
  let totalSkills = 0

  for (const item of ultramanData) {
    const skills = item.skills || []
    for (const skill of skills) {
      totalSkills++
      await generateAudio(item.name, skill, skill)
    }
  }

  console.log(`Done! Generated ${totalSkills} skill audio files.`)
}

main()