import { writeFileSync } from "fs";
import { OpenAI } from "openai";

import images from "./input-wagtail-images-dataset.json" with { type: "json" };

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const classifyImage = async (image) => {
  try {
    const completion = await openAi.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please write a concise description of this image, 200 characters at most. Don’t start your description with generic phrases like 'a photo of' or 'a picture of', just describe. If the image contains legible text, your description has to also transcribe it. If the image is a logo or other text-only visual, only transcribe the text.",
            },
            {
              type: "image_url",
              image_url: {
                url: image.src,
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.log(error.message);
    // Report the error as alt text – make sure to manually review afterwards.
    return error.message;
  }
};

let count = 0;

for (const image of images) {
  console.log(count);

  if (!image.description) {
    console.log(image.src);
    image.description = await classifyImage(image);
    console.log(image.alt);
    console.log(image.description);
  }

  // Copy output-wagtail-images-dataset.json to input-wagtail-images-dataset.json after validation.
  writeFileSync(
    "output-wagtail-images-dataset.json",
    JSON.stringify(images, null, 2)
  );

  count++;

  // Manually increase this after having tested the script (API calls are expensive!).
  if (count > 3) {
    break;
  }
}
