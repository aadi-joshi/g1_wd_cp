class BillingSystem {
    constructor() {
        /* User authentication check
         * Retrieves user data from localStorage
         * Redirects to auth if not logged in
         */
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!this.currentUser) window.location.href = 'auth.html';

        // Initialize product array and setup
        this.products = [];
        this.loadFromLocalStorage();
        this.initializeEvents();
        this.updateInvoiceNumber();
    }

    /* Event binding
     * Uses jQuery for DOM manipulation
     * Handles product addition, bill generation and item removal
     */
    initializeEvents() {
        $('#addProduct').click(() => this.addProduct());
        $('#generateBill').click(() => this.generateBill());
        $(document).on('click', '.remove-item', (e) => this.removeItem(e));
    }

    addProduct() {
        /* Product object creation
         * Retrieves values from form inputs
         * Converts string values to appropriate types
         */
        const product = {
            name: $('#productName').val(),
            price: parseFloat($('#productPrice').val()),
            qty: parseInt($('#productQty').val()),
            gst: parseFloat($('#gstRate').val())
        };

        // Validate and add product
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

    /* UI Update Process
     * Clears existing items list
     * Recalculates all totals
     * Updates DOM with new values
     */
    updateDisplay() {
        $('#itemsList').empty();
        let subtotal = 0;
        let totalGst = 0;

        // Calculate totals and display each product
        this.products.forEach((product, index) => {
            const total = product.price * product.qty;
            const gstAmount = (total * product.gst) / 100;
            
            subtotal += total;
            totalGst += gstAmount;

            // Add product row to table
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

        // Update summary totals
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

    /* Bill Generation Process
     * Collects all form data
     * Creates bill object
     * Saves to user history
     * Triggers PDF generation
     */
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

        // Save bill to user's history
        this.currentUser.bills.push(billData);
        this.saveUserData();

        // Generate PDF
        this.generatePDF(billData);
        alert('Bill generated successfully! PDF will download automatically.');
        this.clearAll();
    }

    generatePDF(billData) {
        const doc = new jspdf.jsPDF();
        
        // Add logo
        const img = new Image();
        img.src = 'assets/logo.png';
        doc.addImage(img, 'PNG', 10, 10, 50, 20);

        // Header
        doc.setFontSize(22);
        doc.text(`INVOICE #${billData.number}`, 110, 20);
        
        // Shop Info
        doc.setFontSize(12);
        doc.text(`${this.currentUser.shop}`, 10, 35);
        doc.text(`GSTIN: ${this.currentUser.gstin}`, 10, 40);

        // Customer Info
        doc.text(`Customer: ${billData.customer}`, 10, 50);
        doc.text(`Date: ${new Date(billData.date).toLocaleDateString()}`, 10, 55);

        // Table Header
        let y = 70;
        doc.setFontSize(14);
        doc.text('Product', 10, y);
        doc.text('Price', 60, y);
        doc.text('Qty', 90, y);
        doc.text('Total', 120, y);
        
        // Table Rows
        doc.setFontSize(12);
        billData.products.forEach(product => {
            y += 10;
            doc.text(product.name, 10, y);
            doc.text(`₹${product.price.toFixed(2)}`, 60, y);
            doc.text(product.qty.toString(), 90, y);
            doc.text(`₹${(product.price * product.qty).toFixed(2)}`, 120, y);
        });

        // Totals
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

    /* Local Storage Operations */
    saveToLocalStorage() {
        // Saves current billing session data
        localStorage.setItem('billingData', JSON.stringify({
            products: this.products,
            customer: $('#customerName').val(),
            date: $('#invoiceDate').val()
        }));
    }

    loadFromLocalStorage() {
        // Retrieves and restores previous session data
        const data = JSON.parse(localStorage.getItem('billingData'));
        if (data) {
            this.products = data.products || [];
            $('#customerName').val(data.customer || '');
            $('#invoiceDate').val(data.date || '');
            this.updateDisplay();
        }
    }

    /* User Data Update Process
     * Gets all users from storage
     * Updates current user's data
     * Saves back to localStorage
     */
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

// Initialize system on page load
$(document).ready(() => {
    billingSystem = new BillingSystem();
});

// Logout handler
function logout() {
    billingSystem.logout();
}