# 📄 Document Upload Feature - Quick Start

## What's New

You can now upload documents (PDF, Word, Text, Markdown) to generate tests without needing a website URL!

---

## How to Use

### Step 1: Select Input Type

On the Crawl page, you'll see a new **"Input Source"** dropdown:

```
┌────────────────────────────────────────┐
│ Input Source *                         │
│ ┌──────────────────────────────────┐  │
│ │ Website URL                    ▼ │  │
│ └──────────────────────────────────┘  │
│ Choose whether to crawl a website or  │
│ upload a document                     │
└────────────────────────────────────────┘
```

### Step 2: Choose Upload Document

Click the dropdown and select **"Upload Document"**:

```
┌────────────────────────────────────────┐
│ Input Source *                         │
│ ┌──────────────────────────────────┐  │
│ │ Upload Document              ▼ │  │
│ └──────────────────────────────────┘  │
│ Choose whether to crawl a website or  │
│ upload a document                     │
└────────────────────────────────────────┘
```

The form will automatically switch to show the file upload area!

### Step 3: Upload Your Document

The form now shows a file upload area:

```
┌────────────────────────────────────────┐
│ Document File                          │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │      📎 Click to upload or      │ │
│  │         drag and drop           │ │
│  │                                  │ │
│  │  .pdf, .doc, .docx, .txt (max   │ │
│  │  50MB)                           │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│ Upload a document to generate tests   │
│ from                                   │
└────────────────────────────────────────┘
```

**Choose one way to upload:**

#### Option A: Drag & Drop

Drag your file from your computer and drop it in the upload area. The area will highlight when you drag over it.

#### Option B: Click to Browse

Click the upload area to open your file picker, then select a file.

### Step 4: See Your File

Once uploaded, your file appears in the upload area:

```
┌────────────────────────────────────────┐
│ Document File                          │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ specifications.pdf               │ │
│  │ 2.4 MB                      ✕    │ │
│  └──────────────────────────────────┘ │
│                                        │
│ Upload a document to generate tests   │
│ from                                   │
└────────────────────────────────────────┘
```

You can remove it anytime by clicking the **✕** button.

### Step 5: Configure & Start

Set your crawl depth and any excluded URLs (same as before), then click **"Start Crawl"**:

```
┌────────────────────────────────────────┐
│ Crawl Depth *                          │
│ ┌──────────────────────────────────┐  │
│ │ 2 — Standard             ▼       │  │
│ └──────────────────────────────────┘  │
│                                        │
│        [START CRAWL BUTTON]            │
└────────────────────────────────────────┘
```

### Step 6: Monitor Progress

Your document appears in the **History** tab with a 📄 icon:

```
History
┌────────────────────────────────────────┐
│ 📄 specifications.pdf        ⏱ 2m 14s │
│ Status: running                        │
│ Pages discovered: 45 / 48              │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 🔗 example.com               ⏱ 1m 32s │
│ Status: completed ✓                    │
│ Pages: 28                              │
└────────────────────────────────────────┘
```

---

## Supported File Types

✅ **PDF Documents** (.pdf)

- PDFs with text content
- Scanned PDFs (if with OCR)

✅ **Word Documents** (.doc, .docx)

- MS Word 2007+ format (.docx)
- Older Word format (.doc)

✅ **Text Files** (.txt, .md)

- Plain text files
- Markdown files (.md)

✅ **Design Documents** (.brd)

- Mockup/wireframe files

**Max file size**: 50 MB

---

## Examples

### Example 1: Upload API Documentation

```
User: Wants to test an API with complex endpoints
Action:
  1. Select "Upload Document"
  2. Upload API_DOCS.pdf (2.3 MB)
  3. Click "Start Crawl"
Result:
  → Test cases generated from API documentation
  → No need for actual website
  → Tests validate all documented endpoints
```

### Example 2: Upload Design Specifications

```
User: Has design specs but site isn't live
Action:
  1. Select "Upload Document"
  2. Upload DESIGN_SPEC.docx (1.1 MB)
  3. Set depth to 2
  4. Click "Start Crawl"
Result:
  → Tests generated from design
  → Ready for development
  → Covers all specified features
```

### Example 3: Mix and Match

```
User: Can choose what works best each time
Session 1: Upload document → Tests from spec
Session 2: Enter website URL → Live site tests
Session 3: Upload PDF → Test compliance
```

---

## Tips & Tricks

### 📌 Best Practices

1. **Keep files organized**
   - Name files clearly: `API_SPEC_v2.pdf` not `spec(1).pdf`
   - Upload specifications, not output files

2. **File content matters**
   - Clear, structured documents work best
   - Well-formatted PDFs generate better tests
   - Add section headers for organization

3. **Size considerations**
   - Smaller files upload faster
   - 50MB limit is generous (most docs are < 5MB)
   - Compress PDFs before uploading if needed

4. **Multiple formats**
   - PDFs: Best for finalized documents
   - DOCX: Good for editable specs
   - Markdown: Great for technical docs

### ⚡ Quick Tips

- **Switching input types resets the form** - if you switch from Document to URL, make sure to enter a URL
- **File removed after crawl?** No, it stays selected until you click ✕
- **Want to upload multiple docs?** Upload one, complete the crawl, then upload another
- **Drag and drop not working?** Try clicking to browse files instead

---

## Troubleshooting

### "File size exceeds 50MB limit"

**Solution**: Compress the PDF or split into smaller files. Most specs don't need to be 50MB.

### "Invalid file type"

**Solution**: Make sure file ends with .pdf, .doc, .docx, .txt, .md, or .brd

### "File upload not responding"

**Solution**:

- Refresh the page
- Try smaller file
- Use different format
- Check file isn't corrupted

### "Can't see file after upload"

**Solution**:

- File was removed after starting crawl
- Select and upload again
- Check browser console for errors

---

## What Happens Behind the Scenes

```
1. You upload a document
   ↓
2. File validated (type, size, format)
   ↓
3. Document sent to backend
   ↓
4. Backend parses document content
   ↓
5. Tests generated from content
   ↓
6. Results displayed in history
```

---

## Switching Between Modes

### URL → Document

```
1. Click "Input Source" dropdown
2. Change from "Website URL" to "Upload Document"
3. URL input field replaced with file upload
4. Enter/upload new info and start crawl
```

### Document → URL

```
1. Click "Input Source" dropdown
2. Change from "Upload Document" to "Website URL"
3. File upload area replaced with URL input
4. Enter URL and start crawl
```

**Note**: Switching clears the previous input (URL or file) from view, but keeps your history intact!

---

## Features & Capabilities

✅ **Drag and drop support** - Drag files from explorer/finder
✅ **Click to browse** - Standard file picker
✅ **Visual feedback** - See what's being uploaded
✅ **Error messages** - Clear feedback if something's wrong
✅ **File removal** - Remove selected file with ✕ button
✅ **Size display** - See file size (KB, MB, GB)
✅ **Dark theme** - Matches your dark UI
✅ **Responsive** - Works on all screen sizes
✅ **Accessible** - Works with keyboard navigation
✅ **Fast** - Instant validation and feedback

---

## History Integration

When you use document upload, your history shows:

```
📄 document_name.pdf     ⏱ Time
Status: [running/completed/failed]
Pages discovered: XX
Pages crawled: YY
```

The 📄 emoji indicates it was from an uploaded document, not a URL.

---

## FAQ

**Q: Can I upload multiple documents at once?**
A: Not yet. Upload one, complete the crawl, then upload another.

**Q: What if my PDF is scanned/image-only?**
A: Basic OCR content may work if available. For best results, use text-based PDFs or Word docs.

**Q: Are uploaded files saved?**
A: Files are not saved after crawl completion. They're processed and results stored, but the original file isn't kept.

**Q: Can I edit the document after uploading?**
A: No, but you can remove it (✕) and upload a new version.

**Q: What happens if crawl fails?**
A: You can remove the file and upload a different one, or try again.

**Q: File format requirements?**
A: No special formatting needed. Well-structured documents work best (clear headings, sections, etc).

---

## Get Started

1. Go to the **Crawl** page
2. Click the **"Input Source"** dropdown
3. Select **"Upload Document"**
4. Upload your file
5. Click **"Start Crawl"**

That's it! Your document-based tests are on the way! 🚀

---

**Document Upload Feature** | Now Available ✨
