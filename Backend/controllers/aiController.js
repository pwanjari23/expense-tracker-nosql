const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.callAiModal = async (req, res) => {
  try {
    const { prompt } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.log("AI ERROR:", error);
    res.status(500).json({ response: "Something went wrong" });
  }
};