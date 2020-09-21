# SPFx Fantastic 40 Web Parts
*Important:* currently its only working with < node 12. I use node 10.22.0 (https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment).

I've forked this project from https://github.com/SharePointPro/spfx-40-fantastics-Sppro

The original can be found here: https://github.com/OlivierCC/spfx-40-fantastics

Update #1: Add ability to customise accordion via custom CSS.

Update #2 Add ability to collapse accordion by default.

Update #3 Update CKEditor to 4.15.0 for accordion and rich text web parts.

Note: With a standard text editor web part on the same page with an accordion web part or rich text editor web part. You will get errors and things won't work. This is because of the standard text editor web part also using a version of CKEditor which is conflicting with the one loaded with accordion or rich text. 

Wordaround: Where you need to use an accordion web part on a page. Instead of using a standard text web part, use the rich text web part to achieve the same functionality.


# The MIT License (MIT)

Copyright (c) 2016 Olivier Carpentier
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
