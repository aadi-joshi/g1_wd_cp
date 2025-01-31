class PDFGenerator {
    generate(billData) {
        const doc = new jspdf.jsPDF();
        
        // Add company logo
        const img = new Image();
        img.src = 'assets/logo.png';
        doc.addImage(img, 'PNG', 10, 10, 50, 20);

        // Add bill content
        doc.setFontSize(22);
        doc.text(`INVOICE #${billData.number}`, 110, 20);
        
        // Add customer details
        doc.setFontSize(12);
        doc.text(`Customer: ${billData.customer}`, 10, 40);
        doc.text(`Date: ${new Date(billData.date).toLocaleDateString()}`, 10, 45);

        // Add table
        let y = 60;
        doc.text('Product', 10, y);
        doc.text('Price', 60, y);
        doc.text('Qty', 90, y);
        doc.text('Total', 120, y);
        y += 5;

        billData.products.forEach(product => {
            y += 10;
            doc.text(product.name, 10, y);
            doc.text(`₹${product.price}`, 60, y);
            doc.text(product.qty, 90, y);
            doc.text(`₹${product.price * product.qty}`, 120, y);
        });

        // Add totals
        y += 20;
        doc.text(`Grand Total: ₹${billData.total}`, 10, y);
        
        // Save PDF
        doc.save(`invoice-${billData.number}.pdf`);
    }
}