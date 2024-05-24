# Alt text benchmark

A comparison of image alt text as it exists on the web in 2024, and image descriptions generated with large language models.

View our results on Google Sheets: [Wagtail images alt text 2024 review](https://docs.google.com/spreadsheets/d/1MgHVWYuKjdLkqiCOJzli7wQKjmjpeHjLL1naJYHeeDw/edit?usp=sharing)

## Install

This currently requires an OpenAI API key,

```bash
fnm use
npm install
cp .env.example .env.sh
# Add your OpenAPI key in .env.sh, then:
source .env.sh
```

## Usage

```bash
node run.mjs
```

After a run, check the contents of the output file, and if it works for you, copy it to the input file ahead of the next run.

Also update the maximum run `count` in the script, to manage your OpenAPI rate limits.

## Prompt

The current prompt has been designed to be simple, with a few tweaks to make descriptions usable as alt text.

> Please write a concise description of this image, 200 characters at most. Don’t start your description with generic phrases like 'a photo of' or 'a picture of', just describe. If the image contains legible text, your description has to also transcribe it. If the image is a logo or other text-only visual, only transcribe the text.

## Rate limits

As of May 2024, here are the rate limits for `gpt-4-vision-preview`:

- 10,000 tokens per minute (you’ll reach that super fast if doing multiple images at the same time, and after some time if you do it sequentially)
- 80 requests per minute – should be fine if doing images sequentially
- 500 requests per day - can be a bottleneck

## Image to text AI options

### Background reading

- [Image-to-text](https://huggingface.co/tasks/imalige-to-text)
- [MaMMUT](https://blog.research.google/2023/05/mammut-simple-vision-encoder-text.html)
- [The latest in Machine Learning | Papers With Code](https://paperswithcode.com/)

### Cloud options

- LLMs
  - [LLaVA](https://github.com/haotian-liu/LLaVA) – current best open source multimodal LLM?
    - [On Replicate](https://replicate.com/yorickvp/llava-13b) it says it runs on an A40 in 5 sec per image, which would be $0.002875/image.
    - [On Hugging Face](https://huggingface.co/spaces/badayvedat/LLaVA) someone says a T4-Small can do it – so that’d be 2x cheaper in Replicate prices.
  - OpenAI GPT 4 vision – see [Open AI vision pricing](https://openai.com/pricing) puts the cost per image (768x768) around $0.00765 (so 3-4x more).
  - [Claude multimodal](https://docs.anthropic.com/claude/docs/vision#image-size) – $0.0048/image
- Pre-LLM
  - [wagtail-alt-generator](https://github.com/marteinn/wagtail-alt-generator)
  - [Describe Image - Describe Image - REST API (Azure Cognitive Services - Computer Vision) | Microsoft Learn](https://learn.microsoft.com/en-us/rest/api/computervision/describe-image/describe-image?view=rest-computervision-v3.1&tabs=HTTP)

### Datasets

- Dataset: https://cocodataset.org/
- [Flickr 8k Dataset](https://www.kaggle.com/datasets/adityajn105/flickr8k)

### Before transformers: CNNs

Object detection / image classification

#### OpenCV

Possible but dated

https://docs.opencv.org/3.0-beta/modules/text/doc/erfilter.html

Built into Wagtail: https://docs.wagtail.org/en/stable/advanced_topics/images/feature_detection.html

### YOLOv8

CNN – optimized for real-time

- https://pjreddie.com/darknet/yolo/
- https://github.com/nihui/ncnn-webassembly-yolov5
- https://huggingface.co/spaces/lmz/candle-yolo
- https://docs.ultralytics.com/usage/python/
- https://docs.ultralytics.com/tasks/detect/
- https://docs.ultralytics.com/integrations/

### After transformers

DIY tutorial: [Image Captioning Using Hugging Face Vision Encoder Decoder — A Step 2 Step Guide (Part 1) | by Kalpesh Mulye | Medium](https://medium.com/@kalpeshmulye/image-captioning-using-hugging-face-vision-encoder-decoder-step-2-step-guide-part-1-495ecb05f0d5)

### LLaVA notes

- https://huggingface.co/docs/transformers/en/model_doc/vision-encoder-decoder
- https://github.com/haotian-liu/LLaVA
- https://ollama.com/library/llava

#### LLaVA in production

- [LLaVA hosting options? : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1775ha5/llava_hosting_options/)
- [yorickvp/llava-13b – API reference](https://replicate.com/yorickvp/llava-13b/api)
- [Pricing – Replicate](https://replicate.com/pricing)
- [ezML - Computer Vision for Apps](https://ezml.io/)

### Marketing

- [Facebook AI for alt text research](https://about.fb.com/news/2021/01/using-ai-to-improve-photo-descriptions-for-blind-and-visually-impaired-people/)
- [Google AI for alt text](https://blog.google/outreach-initiatives/accessibility/get-image-descriptions/)
- [Be my Eyes AI mode](https://www.bemyeyes.com/blog/announcing-be-my-ai)
- [ChatGPT Plus image support](https://www.wired.com/story/chatgpt-plus-image-feature-openai/)
- https://slate.com/technology/2023/10/ai-image-tools-blind-low-vision.html
- Built into Google Chrome: https://support.google.com/chrome/answer/9311597?hl=en

## Dataset

The initial dataset of alt texts corresponds to websites’ homepages indexed by the [HTTP Archive](https://httparchive.org/), that have been identified by Wappalyzer as using the [Wagtail](https://wagtail.org/) CMS.

The "Alt text vs. AI description" dataset is a subset of the initial dataset, containing 700 English SFW images primarily sourced from non-commercial sites (.org, .edu, etc). There are a few commercial images in addition (.com).

Images were extracted from homepages’ HTML with the following regular expression, obtained from [detect-wagtail](https://github.com/thibaudcolas/detect-wagtail):

```bash
rg -o -e '<img[^>]+(\.[a-z]+|\/media)(\/[\w\-]+)?\/(original_images\/[\w\-]+\.|images\/[\w\-.]+\.((fill|max|min|width|height|scale)-\d|original))[^>]+>' wagtail-html > matches.html
rg -o -e '<img[^>]+>' wagtail-html > matches-any-images.html
```

- [2024_04_01_all_alt.csv](./dataset/2024_04_01_all_alt.csv): 35k alt text of images on Wagtail websites’ homepages.
- [2024_04_01_cms_alt.csv](./dataset/2024_04_01_cms_alt.csv): 20k alt text of CMS-managed images on Wagtail websites’ homepages.
- [2024_04_01_wagtail_all_urls.csv](./dataset/2024_04_01_wagtail_all_urls.csv): source website URLs.
