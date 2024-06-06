const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/' , (req,res) =>{
    res.json(1)
});

app.post('/generate_pdf', (req, res) => {
    const { input1, input2 } = req.body;

    const doc = new PDFDocument();
    let filename = 'output.pdf';
    filename = encodeURIComponent(filename);

    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    const fontPath = path.join(__dirname, 'fonts', 'NotoSansDevanagari-Regular.ttf');
    if (!fs.existsSync(fontPath)) {
        console.error("Font file not found at path:", fontPath);
        res.status(500).send("Font file not found");
        return;
    }
    doc.registerFont('NotoSansDevanagari', fontPath);

    doc.font('NotoSansDevanagari')
       .fontSize(12)
       .text(input1, { align: 'center' });

    doc.moveDown();
    doc.text(input2, { align: 'center' });
    doc.on('end', () => {
        console.log("PDF generation completed");
    });

    doc.pipe(res);
    doc.end();
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000 ASh');
});
