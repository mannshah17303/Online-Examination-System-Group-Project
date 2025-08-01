import axios from "axios";

const getAxiosInstance = () => {
  const proxy = {
    host: "",
    port: "",
  };

  return axios.create({
    baseURL: "https://www.google.com/search",
    proxy: proxy,
  });
};

function splitIntoSentences(text) {
  return text.match(/[^\.!\?]+[\.!\?]+/g);
}

async function checkPlagiarismForSentence(sentence, axiosInstance) {
  try {
    const response = axiosInstance.get("", { params: { q: `"${sentence}"` } });
    const data = await response.data;
    return data.includes(sentence);
  } catch (error) {
    return false;
  }
}

export async function checkPlagiarism(text) {
  try {
    const sentences = splitIntoSentences(text);
    // console.log("sentences: ", sentences);
    
    const axiosInstance = getAxiosInstance();

    if (sentences) {
      for (const sentence of sentences) {
        const isPlagiarized = await checkPlagiarismForSentence(
          sentence,
          axiosInstance
        );
        // console.log(`Sentence: ${sentence} == plagiarized: ${isPlagiarized}`);
        return isPlagiarized;
      }
    }
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
}
