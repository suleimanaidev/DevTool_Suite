// All SEO / AEO / GEO content lives here so it is easy to edit in one place.
//  - SEO: titles, descriptions, keywords, canonical URLs, sitemap
//  - AEO (answer engines): short, direct FAQ answers + FAQ/HowTo structured data
//  - GEO (generative AI engines): clear facts, llms.txt, JSON-LD, AI crawlers allowed

// Set NEXT_PUBLIC_SITE_URL to your real domain when you deploy (see .env.local.example).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const SITE = {
  name: "DevTools Suite",
  title: "DevTools Suite - Free Online Tools for Text, Images, Time & Data",
  description:
    "Ten free browser tools in one place: typing test, Markdown editor, invoice maker, stopwatch, word counter, countdown timer, calculator, image metadata viewer, CSV to JSON converter and QR code generator. No sign-up needed.",
  keywords: [
    "free online tools",
    "typing speed test",
    "markdown editor online",
    "invoice generator",
    "online stopwatch",
    "word counter",
    "character counter",
    "countdown timer",
    "online calculator",
    "image metadata viewer",
    "exif viewer",
    "csv to json",
    "qr code generator",
    "wpm test",
  ],
};

// ---------------- The tools ----------------
export const TOOL_SEO = {
  "typing-test": {
    name: "Typing Speed Test",
    path: "/typing-test",
    category: "EducationalApplication",
    title: "Free Typing Speed Test - Check Your WPM and Accuracy",
    description:
      "Take a free typing speed test and see your words per minute (WPM), accuracy and mistakes live. Choose 15, 30 or 60 seconds or set your own time, and add your own paragraphs.",
    keywords: ["typing test", "typing speed test", "wpm test", "typing accuracy", "free typing practice", "custom typing test"],
    about:
      "The Typing Speed Test measures how fast and how accurately you type. Choose an easy, medium or hard paragraph, pick a time limit (15, 30 or 60 seconds, or your own time up to 60 minutes) and start typing. Correct letters turn green and wrong letters turn red, while your WPM, accuracy and mistakes update live. When the time is up, a new paragraph keeps appearing so you never run out of text. Your best score is saved in your browser.",
    features: [
      "Live WPM, accuracy, mistakes and time left",
      "Easy, medium and hard paragraphs (hard ones include punctuation and numbers)",
      "Custom time in seconds or minutes",
      "Add, save and delete your own practice paragraphs",
      "Personal best saved in your browser",
    ],
    steps: [
      { name: "Choose your settings", text: "Pick a difficulty (Easy, Medium or Hard) and a time limit of 15, 30 or 60 seconds, or enter your own time." },
      { name: "Start typing", text: "Click the text box and type the paragraph shown above it. The timer starts on your first keystroke." },
      { name: "Watch your stats", text: "Green letters are correct and red letters are mistakes. WPM and accuracy update as you type." },
      { name: "Check your result", text: "When time runs out, your final WPM, accuracy and mistakes are shown. Beat your best score to earn the New Record badge." },
    ],
    faq: [
      { q: "What is WPM in a typing test?", a: "WPM means words per minute. It shows how many words you can type in one minute. In this test, one word is counted as five characters." },
      { q: "How is WPM calculated here?", a: "WPM = (number of correct characters / 5) / minutes. Only correct characters count, so mistakes lower your score." },
      { q: "What is a good typing speed?", a: "The average adult types about 40 WPM. 50 to 70 WPM is considered good, and above 80 WPM is fast. Accuracy matters as much as speed." },
      { q: "Can I use my own text?", a: "Yes. Add your own paragraph (at least 20 characters) in the Custom paragraphs box. It is saved in your browser and you can practice with it any time." },
      { q: "Is the typing test free?", a: "Yes. It is completely free and needs no account. Your scores stay in your own browser." },
    ],
  },

  markdown: {
    name: "Markdown Editor",
    path: "/markdown",
    category: "DeveloperApplication",
    title: "Free Markdown Editor with Live Preview and Bold/Italic Text Generator",
    description:
      "Write Markdown and see a live preview side by side. Includes line numbers, word count, auto-save and a bold, italic and bold-italic Unicode text generator you can copy anywhere.",
    keywords: ["markdown editor", "markdown previewer", "online markdown editor", "markdown live preview", "bold italic text generator", "unicode bold text"],
    about:
      "The Markdown Editor lets you write Markdown on the left and see the formatted result on the right instantly. It supports headings, bold, italic, strikethrough, inline code, code blocks, links, images, lists, blockquotes and horizontal rules. Below the preview, the text styler turns any text into bold, italic or bold-italic Unicode letters that you can paste into social media bios, comments and messages. Everything is saved automatically in your browser.",
    features: [
      "Live split-screen preview with line numbers",
      "Headings, bold, italic, strikethrough, code, links, images, lists, quotes and rules",
      "HTML is escaped, and only http, https and mailto links are allowed",
      "Word and character count",
      "10 bold, italic and bold-italic Unicode text styles with one-click copy",
      "Auto-save in your browser",
    ],
    steps: [
      { name: "Write your Markdown", text: "Type or paste Markdown into the editor on the left." },
      { name: "Check the preview", text: "The formatted result appears on the right as you type." },
      { name: "Style some text (optional)", text: "Select words in the editor, then use the bold, italic and bold-italic styles under the preview to copy them or put them back into the editor." },
    ],
    faq: [
      { q: "What is Markdown?", a: "Markdown is a simple way to format text using plain characters, for example # for a heading and ** around a word to make it bold. It is widely used in README files, documentation and notes." },
      { q: "How do I make text bold or italic in Markdown?", a: "Put two asterisks around text for bold (**bold**) and one asterisk for italic (*italic*). Use two tildes for strikethrough (~~text~~)." },
      { q: "How can I write bold or italic text on social media?", a: "Social sites do not support Markdown, so use the Unicode text styler on this page. Type your text, copy a style such as bold sans or italic serif, and paste it anywhere." },
      { q: "Is the preview safe from HTML or script injection?", a: "Yes. All HTML in your text is escaped before it is converted, and only http, https and mailto links are allowed." },
      { q: "Is my text saved?", a: "Your text is saved automatically in your own browser (local storage). It is never uploaded to a server." },
    ],
  },

  invoice: {
    name: "Invoice Generator",
    path: "/invoice",
    category: "BusinessApplication",
    title: "Free Invoice Generator - Create and Download PDF Invoices",
    description:
      "Create a professional invoice online for free. Add items, tax and discount, choose a currency, color and layout, then download it as a PDF.",
    keywords: ["invoice generator", "free invoice maker", "create invoice online", "invoice pdf", "invoice template", "billing"],
    about:
      "The Invoice Generator helps you create a clean, professional invoice in a few minutes. Fill in the client, add line items, set tax and discount, and watch the A4 invoice update live. Choose from 8 color themes or any custom color, and pick a Classic, Modern or Minimal layout. It supports PKR, USD, EUR, GBP, AED, SAR and INR. Download the result as a PDF using your browser's print dialog, or save invoices in your browser to open, duplicate or delete later.",
    features: [
      "Live A4 invoice preview",
      "Automatic subtotal, discount, tax and total",
      "7 currencies: PKR, USD, EUR, GBP, AED, SAR, INR",
      "8 color themes plus a custom color picker",
      "3 layouts: Classic, Modern and Minimal",
      "Logo upload, notes and Paid / Unpaid / Overdue stamp",
      "Auto-increment invoice numbers and saved invoices",
    ],
    steps: [
      { name: "Enter the client", text: "Type the client's name (required), email and address." },
      { name: "Add your items", text: "Add each item with a description, quantity and price. Set the tax percentage and any discount." },
      { name: "Set the details", text: "Check the invoice number, dates and currency. Add your business details, logo and payment notes." },
      { name: "Pick a style and download", text: "Choose a color and layout, then click Download PDF and select Save as PDF in the print window." },
    ],
    faq: [
      { q: "How do I create an invoice online?", a: "Enter the client details, add your items with quantity and price, set tax and discount if needed, and click Download PDF. The totals are calculated automatically." },
      { q: "What should an invoice include?", a: "A clear invoice shows your business name and contact details, the client's details, a unique invoice number, the issue and due dates, itemized charges, tax, the total, and payment instructions." },
      { q: "Which currencies are supported?", a: "PKR, USD, EUR, GBP, AED, SAR and INR, each with the correct symbol and number format." },
      { q: "How do I save the invoice as a PDF?", a: "Click Download PDF and choose Save as PDF as the printer in your browser's print window. Only the invoice is printed, on an A4 page." },
      { q: "Is my invoice data private?", a: "Yes. Your invoices are saved only in your own browser. Nothing is uploaded to a server." },
    ],
  },

  stopwatch: {
    name: "Online Stopwatch",
    path: "/stopwatch",
    category: "UtilitiesApplication",
    title: "Online Stopwatch with Lap Timer",
    description:
      "A free online stopwatch with start, pause, resume and lap times. See your fastest and slowest lap with centisecond precision.",
    keywords: ["online stopwatch", "stopwatch", "lap timer", "free stopwatch", "timer with laps"],
    about:
      "The Online Stopwatch times anything with centisecond precision. Press Start to begin, Pause to stop and Resume to carry on. Press Lap while it is running to record lap times, and the fastest and slowest laps are marked so you can compare them easily. Short sound effects confirm the start, every lap and a reset.",
    features: [
      "Start, pause, resume and reset",
      "Unlimited lap times with the total time for each lap",
      "Fastest and slowest lap highlighted",
      "Centisecond precision",
      "Short sound effects on start, lap and reset",
    ],
    steps: [
      { name: "Press Start", text: "The stopwatch begins counting immediately." },
      { name: "Record laps", text: "Press Lap at any moment to save a lap time. The newest lap appears at the top." },
      { name: "Pause or reset", text: "Press Pause to stop, Resume to continue, or Reset to clear the time and all laps." },
    ],
    faq: [
      { q: "How do I use the lap button?", a: "While the stopwatch is running, press Lap to record the time since the previous lap. The total elapsed time is shown next to it." },
      { q: "How accurate is the stopwatch?", a: "It shows time to 1/100 of a second (centiseconds) and is based on your device's clock." },
      { q: "Can I pause and continue?", a: "Yes. Press Pause to stop and Resume to continue from the same time." },
      { q: "Does the stopwatch make a sound?", a: "Yes. There is a short rising tone when you start or resume, a click when you record a lap, and a falling tone when you reset." },
      { q: "Is the stopwatch free?", a: "Yes, it is free and needs no account." },
    ],
  },

  "word-counter": {
    name: "Word Counter",
    path: "/word-counter",
    category: "UtilitiesApplication",
    title: "Free Word Counter - Count Words, Characters and Reading Time",
    description:
      "Count words, characters (with and without spaces), sentences and paragraphs as you type, and see the reading and speaking time instantly. Free, private, no sign-up.",
    keywords: ["word counter", "character counter", "word count tool", "reading time calculator", "count words online", "character count"],
    about:
      "The Word Counter shows the size of your text as you type or paste it. It counts words, characters with and without spaces, sentences and paragraphs, and estimates reading time at 200 words per minute and speaking time at 130 words per minute. The most used words are listed too, with common short words removed. Your text is saved in your browser, so it is still there when you come back.",
    features: [
      "Live word count as you type",
      "Characters with and without spaces",
      "Sentences, paragraphs and lines",
      "Reading time (200 WPM) and speaking time (130 WPM)",
      "Most used words with counts and percentages",
      "Copy or clear the text, with automatic saving in your browser",
    ],
    steps: [
      { name: "Paste your text", text: "Type or paste text into the box on the page." },
      { name: "Watch the counts update", text: "Words, characters, sentences and paragraphs update live as you type." },
      { name: "Check the reading time", text: "Reading time is based on 200 words per minute. Speaking time uses 130 words per minute." },
      { name: "Copy or save", text: "Use Copy to put the text on your clipboard. The draft is saved in this browser automatically." },
    ],
    faq: [
      { q: "How is the word count calculated?", a: "Words are counted by splitting the text on spaces, so \"don't stop\" counts as two words." },
      { q: "Does the character count include spaces?", a: "It shows both: characters with spaces and characters without spaces." },
      { q: "How is reading time calculated?", a: "Reading time uses 200 words per minute, a common average for adults. Speaking time uses 130 words per minute." },
      { q: "Is the word counter free?", a: "Yes. It is free and needs no account." },
      { q: "Is my text uploaded?", a: "No. Your text is stored only in your own browser (local storage) and is never sent to a server." },
    ],
  },

  countdown: {
    name: "Countdown Timer",
    path: "/countdown",
    category: "UtilitiesApplication",
    title: "Free Online Countdown Timer - Set a Custom Timer",
    description:
      "Set a countdown in hours, minutes and seconds. Start, pause and resume, use quick presets, add a label, and hear a tick in the last 10 seconds plus a sound when time is up. Free and no sign-up.",
    keywords: ["countdown timer", "online timer", "custom countdown", "timer online", "countdown clock", "kitchen timer"],
    about:
      "The Countdown Timer counts down from any time you choose, up to 99 hours. Type hours, minutes and seconds or pick a preset such as 5, 10 or 25 minutes. Press Start and the timer counts down to zero, with a progress ring, an optional label and sound effects. A short tone plays on start and reset, the last 10 seconds tick like a clock, and a chime marks the end. Pause, resume or reset at any point, and the timer stays accurate if you switch tabs because it works from your device's clock.",
    features: [
      "Custom time in hours, minutes and seconds (up to 99:59:59)",
      "Quick presets from 1 to 60 minutes",
      "Start, pause, resume and reset",
      "Progress ring and a warning colour in the last 10 seconds",
      "Optional label and sound effects (start, final 10 seconds, end)",
      "Timer stays accurate when you switch tabs",
    ],
    steps: [
      { name: "Set the time", text: "Enter hours, minutes and seconds, or choose a preset." },
      { name: "Add a label (optional)", text: "Give the timer a name such as Tea, Exam or Workout." },
      { name: "Start the countdown", text: "Press Start. Press Pause to stop and Resume to continue." },
      { name: "Finish or reset", text: "At zero, the timer shows Time's up! and plays a sound if it is turned on. Press Reset to go again." },
    ],
    faq: [
      { q: "How do I set a custom countdown?", a: "Enter hours, minutes and seconds in the Set the time box, then press Start. You can also click a preset such as 5 or 25 minutes." },
      { q: "Does the timer keep running if I switch tabs?", a: "Yes. It counts from your device's clock, so it stays accurate when the tab is in the background." },
      { q: "Can I pause and resume?", a: "Yes. Press Pause and the remaining time is kept; press Resume to continue from the same point." },
      { q: "Does it play a sound when it ends?", a: "Yes, if sounds are turned on. You hear a short tone on start and reset, a tick each second during the last 10 seconds, and a chime when time is up. Browsers only allow sound after you interact with the page, which happens when you press Start." },
      { q: "Is the countdown timer free?", a: "Yes. It is free and needs no account." },
    ],
  },

  calculator: {
    name: "Online Calculator",
    path: "/calculator",
    category: "UtilitiesApplication",
    title: "Free Online Calculator with History and Keyboard Support",
    description:
      "Use a free online calculator for addition, subtraction, multiplication, division, percentages and negative numbers. Full keyboard support and a saved history of your calculations.",
    keywords: ["online calculator", "free calculator", "basic calculator", "calculator with history", "percentage calculator", "keyboard calculator"],
    about:
      "The Online Calculator handles everyday arithmetic: addition, subtraction, multiplication, division, percentages and negative numbers. Press the on-screen keys or use your keyboard. Chained calculations work normally, pressing equals again repeats the last operation, and dividing by zero shows a clear error. Every finished calculation is added to the history, where you can click a result to use it again. Your history is saved in your browser and never sent to a server.",
    features: [
      "Add, subtract, multiply and divide",
      "Percent and sign (negative number) buttons",
      "Chained calculations and repeated equals",
      "Keyboard support for digits, operators, Enter, Backspace and Esc",
      "Calculation history with one-click result reuse",
      "History saved in your browser",
    ],
    steps: [
      { name: "Enter the first number", text: "Use the on-screen keys or your keyboard to type a number." },
      { name: "Choose an operator", text: "Press +, −, × or ÷, then enter the second number." },
      { name: "Press equals", text: "Press = or the Enter key to see the result. Press = again to repeat the last operation." },
      { name: "Reuse the history", text: "Finished calculations are listed on the right. Click any result to continue with it." },
    ],
    faq: [
      { q: "Is the calculator free?", a: "Yes. It is completely free and needs no account." },
      { q: "Can I use my keyboard?", a: "Yes. Use 0–9, the decimal point, + − * /, Enter or = to calculate, Backspace to delete, % for percent and Esc to clear." },
      { q: "How does the percent button work?", a: "For a plain number it divides by 100. In an addition or subtraction it uses a share of the first number, so 200 + 10% gives 220." },
      { q: "Can I reuse a previous result?", a: "Yes. Click any entry in the history and its result becomes the current number." },
      { q: "Is my calculation history private?", a: "Yes. It is stored only in your own browser (local storage) and is never uploaded to a server." },
    ],
  },

  "image-metadata": {
    name: "Image Metadata Viewer",
    path: "/image-metadata",
    category: "UtilitiesApplication",
    title: "Free Image Metadata Viewer - EXIF, GPS and File Details",
    description:
      "Inspect image metadata in your browser: EXIF camera settings, date taken, GPS location, dimensions and file details. Works with JPEG, PNG, TIFF and HEIC. No upload.",
    keywords: ["image metadata viewer", "exif viewer", "photo metadata", "image exif online", "check image gps", "image details"],
    about:
      "The Image Metadata Viewer reads the EXIF, XMP and file information in a photo without uploading it. Drop a JPEG, PNG, TIFF or HEIC file to see its dimensions, file size, camera make and model, lens, exposure, aperture, ISO, focal length, date taken and GPS coordinates when present. A full table lists every metadata field that was found, and the whole result can be copied as JSON. Files are processed in your browser only.",
    features: [
      "Drop an image or choose a file",
      "Camera make, model, lens and exposure settings",
      "Date taken and GPS coordinates with a map link",
      "Image dimensions, megapixels and file size",
      "Full metadata table with a copy-as-JSON button",
      "Runs locally; the image is never uploaded",
    ],
    steps: [
      { name: "Choose an image", text: "Drop a JPEG, PNG, TIFF or HEIC file onto the page, or click to choose one." },
      { name: "Read the summary", text: "The file details, dimensions, camera settings and GPS location are shown in the File & image card." },
      { name: "Inspect all metadata", text: "Scroll down to see every EXIF, XMP and file field that was found." },
      { name: "Copy the result", text: "Use Copy JSON to put the file details and metadata on your clipboard." },
    ],
    faq: [
      { q: "What is image metadata?", a: "Image metadata is extra information saved inside a photo, such as the camera model, date taken, exposure settings and sometimes GPS coordinates. The most common format is EXIF." },
      { q: "Which image formats are supported?", a: "JPEG, TIFF and HEIC/HEIF usually contain the most metadata. PNG support is more limited, while WebP and GIF often contain almost none. Dimensions and file details are still shown whenever the browser can read the image." },
      { q: "Is my image uploaded?", a: "No. The image is read in your browser and never sent to a server." },
      { q: "Why is some metadata missing?", a: "Websites, messaging apps and screenshot tools often remove metadata to protect privacy. If the fields were not saved in the file, they cannot be shown." },
      { q: "Does it show where a photo was taken?", a: "Yes, when the file contains GPS data. The coordinates are listed and linked to OpenStreetMap." },
      { q: "Why can I not see a HEIC preview?", a: "Some browsers cannot decode HEIC images. The metadata can still be read in many cases, and the file information is always shown." },
    ],
  },

  "csv-to-json": {
    name: "CSV to JSON Converter",
    path: "/csv-to-json",
    category: "DeveloperApplication",
    title: "Free CSV to JSON Converter - Convert CSV Online",
    description:
      "Convert CSV to JSON in your browser. Paste a CSV or open a file, choose the delimiter, use the first row as keys, then copy or download the JSON. No upload.",
    keywords: ["csv to json", "convert csv to json", "csv converter", "json converter", "csv to json online", "csv parser"],
    about:
      "The CSV to JSON Converter turns comma-separated data into clean JSON. Paste CSV text or open a .csv or .tsv file, and the converter handles quoted fields, escaped quotes and line breaks inside quotes. It can detect the delimiter automatically, use the first row as object keys, trim whitespace and pretty-print the result. Duplicate column names are renamed so no data is lost. Copy the JSON or download it as a .json file. Everything runs in your browser.",
    features: [
      "Paste CSV text or open a .csv or .tsv file",
      "Automatic delimiter detection, or choose comma, semicolon, tab or pipe",
      "First row as object keys, or an array of rows",
      "Handles quoted fields, escaped quotes and line breaks",
      "Trim whitespace and pretty-print options",
      "Copy or download the JSON; data never leaves the browser",
    ],
    steps: [
      { name: "Add your CSV", text: "Paste it into the input box, choose a file, or drag a .csv file onto the page." },
      { name: "Set the options", text: "Check the delimiter, whether the first row is a header, and whether to trim whitespace." },
      { name: "Check the JSON", text: "The converted JSON appears on the right and updates as you change the options." },
      { name: "Copy or download", text: "Use Copy for the clipboard or Download to save a .json file." },
    ],
    faq: [
      { q: "How do I convert CSV to JSON?", a: "Paste your CSV into the input box or open a file, then choose the delimiter and header options. The JSON output appears immediately; use Copy or Download to take it with you." },
      { q: "My CSV uses semicolons or tabs. Does that work?", a: "Yes. Leave the delimiter on Detect automatically, or choose semicolon, tab or pipe from the list." },
      { q: "What does the header option do?", a: "When it is ticked, the first row becomes the property names and the remaining rows become objects. When it is unticked, every row is kept as an array." },
      { q: "Does it handle commas and quotes inside values?", a: "Yes. Quoted fields, escaped double quotes and line breaks inside quotes are all handled." },
      { q: "What happens to duplicate column names?", a: "They are renamed with a suffix such as name_2, and a warning lists the changes." },
      { q: "Is my CSV uploaded?", a: "No. The file is read and converted entirely in your browser." },
    ],
  },

  "qr-code": {
    name: "QR Code Generator",
    path: "/qr-code",
    category: "UtilitiesApplication",
    title: "Free QR Code Generator - Create and Download QR Codes",
    description:
      "Create a QR code for a link, text or contact details. Choose the size, margin and error correction, then download a crisp Classic PNG or SVG. Free and private.",
    keywords: ["qr code generator", "free qr code", "create qr code", "qr code png", "qr code svg", "online qr generator"],
    about:
      "The QR Code Generator turns a link or any text into a scannable QR code in the classic dark-on-cream style. Type or paste your content and the preview updates as you go. Choose the image size, quiet-zone margin and error-correction level, then download the finished code as a PNG for documents and social posts, or as an SVG for print and design work. The code is generated in your browser, so your content is never uploaded.",
    features: [
      "QR codes for links, text, Wi-Fi details and more",
      "Live preview while you type",
      "Size options from 128 to 1024 pixels",
      "Adjustable margin and four error-correction levels",
      "Classic dark-on-cream output for reliable scanning",
      "Download as PNG or SVG, or copy the PNG image",
    ],
    steps: [
      { name: "Enter the content", text: "Paste a URL or type the text you want the QR code to contain." },
      { name: "Adjust the size", text: "Choose a size, margin and error-correction level." },
      { name: "Scan or check", text: "The preview updates automatically. Test it with your phone camera if you like." },
      { name: "Download", text: "Use Download PNG for everyday use or Download SVG for print and design work." },
    ],
    faq: [
      { q: "How do I create a QR code?", a: "Type or paste your link or text, adjust the size, margin and error correction, then click Download PNG or Download SVG. The preview updates as you type." },
      { q: "What is error correction?", a: "It controls how much of the QR code can be damaged or covered and still scan. Higher levels are more robust but make the pattern denser. Medium (15%) is a good default." },
      { q: "Can I download the QR code as a file?", a: "Yes. PNG is best for screens and documents, and SVG is a vector file that stays sharp at any size for printing." },
      { q: "Can I change the QR code colors?", a: "No. The generator always uses the classic dark-on-cream style, which keeps strong contrast and reliable scans." },
      { q: "Why is the QR code not appearing?", a: "If the content is too long, it may not fit at the selected error-correction level. Shorten the text or choose a lower level such as Low." },
      { q: "Is my content uploaded?", a: "No. The QR code is generated entirely in your browser." },
    ],
  },
};

// ---------------- Questions shown on the landing page ----------------
export const HOME_FAQ = [
  { q: "What is DevTools Suite?", a: "DevTools Suite is a free website with ten everyday tools for text, images, files and time: typing test, Markdown editor, invoice maker, stopwatch, word counter, countdown timer, calculator, image metadata viewer, CSV to JSON converter and QR code generator." },
  { q: "Is DevTools Suite free to use?", a: "Yes. All tools are free and you do not need to create an account." },
  { q: "Where is my data stored?", a: "Typing scores, Markdown text, invoice data, word counter drafts, calculator history and saved settings are stored only in your own browser. Images, CSV text and QR content are processed locally and never uploaded." },
  { q: "Are my images and files uploaded?", a: "No. Image metadata, CSV conversion and QR code generation all run inside your browser. Nothing is sent to a server." },
  { q: "Can I download an invoice as a PDF?", a: "Yes. Open the Invoice Generator, fill in your details and click Download PDF, then choose Save as PDF in the print window." },
];

// ---------------- Helpers ----------------
export const url = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;

// Next.js metadata for a tool page (used by each tool's layout.js)
export function toolMetadata(slug) {
  const t = TOOL_SEO[slug];
  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: { canonical: t.path },
    openGraph: {
      title: t.title,
      description: t.description,
      url: t.path,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description },
  };
}

// Structured data (JSON-LD) for a tool page: app + how-to + FAQ + breadcrumbs
export function toolJsonLd(slug) {
  const t = TOOL_SEO[slug];
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: t.name,
      url: url(t.path),
      description: t.description,
      applicationCategory: t.category,
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript",
      inLanguage: "en",
      isAccessibleForFree: true,
      featureList: t.features,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isPartOf: { "@type": "WebSite", name: SITE.name, url: url("/") },
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to use the ${t.name}`,
      step: t.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
    },
    faqJsonLd(t.faq),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: url("/") },
        { "@type": "ListItem", position: 2, name: t.name, item: url(t.path) },
      ],
    },
  ];
}

export function faqJsonLd(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// Structured data for the landing page
export function homeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: url("/"),
      description: SITE.description,
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: url("/"),
      logo: url("/icon.svg"),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "DevTools Suite tools",
      itemListElement: Object.values(TOOL_SEO).map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: t.name,
          url: url(t.path),
          description: t.description,
          applicationCategory: t.category,
          operatingSystem: "Any (web browser)",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      })),
    },
    faqJsonLd(HOME_FAQ),
  ];
}
