class PDFGenerator {
    generate(billData) {
        const doc = new jspdf.jsPDF();
        
        // we have allowed addition of logo, it could be a company logo
        const img = new Image();
        img.src = 'assets/logo.png';
        doc.addImage(img, 'PNG', 10, 10, 50, 20);

        doc.setFontSize(22);
        doc.text(`INVOICE #${billData.number}`, 110, 20);
        // we will put the customer and shop info over here
        doc.setFontSize(12);
        doc.text(`${billData.shop}`, 10, 35);
        doc.text(`GSTIN: ${billData.gstin}`, 10, 40);
        doc.text(`Customer: ${billData.customer}`, 10, 50);
        doc.text(`Date: ${new Date(billData.date).toLocaleDateString()}`, 10, 55);

        let y = 70;
        doc.setFontSize(14);
        doc.text('Product', 10, y);
        doc.text('Price', 60, y);
        doc.text('Qty', 90, y);
        doc.text('Total', 120, y);
        doc.setFontSize(12);
        billData.products.forEach(product => {
            y += 10;
            doc.text(product.name, 10, y);
            doc.text(`₹${product.price.toFixed(2)}`, 60, y);
            doc.text(product.qty.toString(), 90, y);
            doc.text(`₹${(product.price * product.qty).toFixed(2)}`, 120, y);
        });

        y += 20;
        doc.setFontSize(14);
        doc.text(`Subtotal: ₹${billData.subtotal.toFixed(2)}`, 10, y);
        doc.text(`CGST: ₹${billData.cgst.toFixed(2)}`, 10, y + 8);
        doc.text(`SGST: ₹${billData.sgst.toFixed(2)}`, 10, y + 16);
        doc.text(`Grand Total: ₹${billData.total.toFixed(2)}`, 10, y + 24, { fontWeight: 'bold' });

        doc.save(`invoice-${billData.number}.pdf`);
    }
}