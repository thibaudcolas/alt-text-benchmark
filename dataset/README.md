# Dataset

Notes relating to data processing.

```bash
grep '5k/html' wagtail-filenames.csv | tr '\n' ' ' >> oneline.txt
# Selective unzipping of only the files we need.
unzip -d html/5k -j 5k.zip 5k/html/leetcode.com.home.html 5k/html/www.fut.gg.home.html 5k/html/www.nhs.uk.home.html 5k/html/www.vinmec.com.home.html
```
