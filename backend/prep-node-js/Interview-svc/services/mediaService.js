const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const { spawn } = require("child_process");

const lipsyncAI = require("./lipsyncAI"); // Hypothetical AI-based lip-sync module

exports.textToSpeech = async (text) => {
  try {
    const response = await axios.post(
      "https://texttospeech.googleapis.com/v1/text:synthesize",
      {
        input: { text },
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" },
      },
      {
        headers: { Authorization: `Bearer ${process.env.GOOGLE_TTS_API_KEY}` },
      }
    );

    const audioContent = Buffer.from(response.data.audioContent, "base64");
    const audioPath = path.join(__dirname, "../temp", `${Date.now()}.mp3`);
    await fs.writeFile(audioPath, audioContent);

    return audioPath;
  } catch (error) {
    console.error("Error in text-to-speech:", error);
    throw error;
  }
};

exports.generateLipSync = async (audioPath) => {
  try {
    const baseImagePath = path.join(
      __dirname,
      "../assets",
      "interviewer_base.jpg"
    );
    const outputVideoPath = path.join(
      __dirname,
      "../temp",
      `${Date.now()}_lipsync.mp4`
    );

    await lipsyncAI.generateVideo(baseImagePath, audioPath, outputVideoPath);

    return outputVideoPath;
  } catch (error) {
    console.error("Error in lip-sync generation:", error);
    throw error;
  }
};
