class BillingSystem {
    constructor() {
        // redirects user if they arent logged in
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!this.currentUser) window.location.href = 'auth.html';
        this.products = [];
        this.loadFromLocalStorage();
        this.initializeEvents();
        this.updateInvoiceNumber();
    }

    // product addition, bill generation, item removal
    // jquery for dom manipulation
    initializeEvents() {
        $('#addProduct').click(() => this.addProduct());
        $('#generateBill').click(() => this.generateBill());
        $(document).on('click', '.remove-item', (e) => this.removeItem(e));
    }

    addProduct() {
        // this method creates product object
        // takes the value from form inputs
        // also used for input type conversion
        const product = {
            name: $('#productName').val(),
            price: parseFloat($('#productPrice').val()),
            qty: parseInt($('#productQty').val()),
            gst: parseFloat($('#gstRate').val())
        };

        // below block validates and adds the code
        if (this.validateProduct(product)) {
            this.products.push(product);
            this.updateDisplay();
            this.saveToLocalStorage();
            this.clearInputs();
        }
    }

    validateProduct(product) {
        if (!product.name) {
            alert('Please enter product name');
            return false;
        }
        if (isNaN(product.price) || product.price <= 0) {
            alert('Please enter valid price');
            return false;
        }
        if (isNaN(product.qty) || product.qty <= 0) {
            alert('Please enter valid quantity');
            return false;
        }
        return true;
    }

    updateDisplay() {
        $('#itemsList').empty();
        let subtotal = 0;
        let totalGst = 0;
        this.products.forEach((product, index) => {
            const total = product.price * product.qty;
            const gstAmount = (total * product.gst) / 100;
            
            subtotal += total;
            totalGst += gstAmount;

            // add product row to table
            $('#itemsList').append(`
                <tr>
                    <td>${product.name}</td>
                    <td>₹${product.price.toFixed(2)}</td>
                    <td>${product.qty}</td>
                    <td><span class="gst-badge">${product.gst}% GST</span></td>
                    <td>₹${total.toFixed(2)}</td>
                    <td><button class="btn btn-sm btn-danger remove-item" data-index="${index}">×</button></td>
                </tr>
            `);
        });

        // update summary totals
        $('#subtotal').text(`₹${subtotal.toFixed(2)}`);
        $('#cgst').text(`₹${(totalGst / 2).toFixed(2)}`);
        $('#sgst').text(`₹${(totalGst / 2).toFixed(2)}`);
        $('#grandTotal').text(`₹${(subtotal + totalGst).toFixed(2)}`);
    }

    removeItem(e) {
        const index = $(e.target).data('index');
        this.products.splice(index, 1);
        this.updateDisplay();
        this.saveToLocalStorage();
    }

    // takes input from forms
    // creates bill object
    // initiated bill generation process
    generateBill() {
        if (this.products.length === 0) {
            alert('Please add items to generate bill');
            return;
        }

        const billData = {
            customer: $('#customerName').val(),
            date: $('#invoiceDate').val(),
            number: $('#invoiceNo').val(),
            products: this.products,
            subtotal: parseFloat($('#subtotal').text().replace('₹', '')),
            cgst: parseFloat($('#cgst').text().replace('₹', '')),
            sgst: parseFloat($('#sgst').text().replace('₹', '')),
            total: parseFloat($('#grandTotal').text().replace('₹', ''))
        };
        this.currentUser.bills.push(billData);
        this.saveUserData();
        this.generatePDF(billData); // this is where pdf is generated
        alert('Bill generated successfully! PDF will download automatically.');
        this.clearAll();
    }

    generatePDF(billData) {
        const doc = new jspdf.jsPDF();
        const img = new Image(); // logo
        img.src = 'assets/logo.png';
        doc.addImage(img, 'PNG', 10, 10, 50, 20);
        doc.setFontSize(22);
        doc.text(`INVOICE #${billData.number}`, 110, 20);
        
        // shop and customer Info
        doc.setFontSize(12);
        doc.text(`${this.currentUser.shop}`, 10, 35);
        doc.text(`GSTIN: ${this.currentUser.gstin}`, 10, 40);
        doc.text(`Customer: ${billData.customer}`, 10, 50);
        doc.text(`Date: ${new Date(billData.date).toLocaleDateString()}`, 10, 55);
        let y = 70; // table header and rows
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

    updateInvoiceNumber() {
        const number = Math.floor(Math.random() * 900000) + 100000;
        $('#invoiceNo').val(`INV-${number}`);
    }

    clearInputs() {
        $('#productName, #productPrice').val('');
        $('#productQty').val(1);
    }

    clearAll() {
        this.products = [];
        $('#customerName').val('');
        $('#invoiceDate').val('');
        this.updateInvoiceNumber();
        this.updateDisplay();
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        // starting from this all are local storage functions
        // this function saves current billing session data
        localStorage.setItem('billingData', JSON.stringify({
            products: this.products,
            customer: $('#customerName').val(),
            date: $('#invoiceDate').val()
        }));
    }

    loadFromLocalStorage() {
        // retrieves and restores previous session data
        const data = JSON.parse(localStorage.getItem('billingData'));
        if (data) {
            this.products = data.products || [];
            $('#customerName').val(data.customer || '');
            $('#invoiceDate').val(data.date || '');
            this.updateDisplay();
        }
    }

    saveUserData() {
        const users = JSON.parse(localStorage.getItem('gstUsers'));
        const index = users.findIndex(u => u.email === this.currentUser.email);
        users[index] = this.currentUser;
        localStorage.setItem('gstUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'auth.html';
    }
}

$(document).ready(() => {
    billingSystem = new BillingSystem();
});

// handles logout
function logout() {
    billingSystem.logout();
}