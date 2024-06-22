import fetch from "node-fetch";
export const verifyComment = async (req, res, next) => {
  const text = req.body.text
  const isProfanity = await checkProfanity(text);
  if (isProfanity) {
      return res.status(400).json({ message: 'Your comment contains inappropriate content.' });
  }else{
    next();
  }
};
export const verifyBlog = async (req, res, next) => {
    const {title, description } = req.body;
    console.log("inn");
    const profanityTitle = await checkProfanity(req.body.title);
    console.log(profanityTitle);
    const profanityDescription = await checkProfanity(description);
    if (profanityTitle ||  profanityDescription) {
        return res.status(400).json({ message: 'You are using inappropriate content.' });
    }else{
        next();
    }
};
async function checkProfanity(message) {
    const apiUser = process.env.API_USER;
    const apiSecret = process.env.API_SECRET;
    console.log(apiUser +" "+ apiSecret);
    const formBody = new URLSearchParams();
    formBody.append("api_user", apiUser);
    formBody.append("api_secret", apiSecret);
    formBody.append("text", message);
    formBody.append("mode", "rules");
    formBody.append("lang", "en,fr,es");

    const response = await fetch("https://api.sightengine.com/1.0/text/check.json", {
        method: "POST",
        body: formBody,
    });

    const result = await response.json();

    if (result.status === "failure") {
        throw new Error(`API call failed: ${result.error.message}`);
    }

    return result.profanity && result.profanity.matches && result.profanity.matches.length > 0;
}