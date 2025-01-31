class BillingSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(!this.currentUser) window.location.href = 'auth.html';
        
        this.products = this.currentUser.products || [];
        this.bills = this.currentUser.bills || [];
        
        this.initialize();
    }

    initialize() {
        this.initializeEvents();
        this.updateInvoiceNumber();
        this.loadProducts();
        this.showShopName();
        this.loadFromLocalStorage();
    }

    showShopName() {
        $('#currentShopName').text(this.currentUser.shop);
    }

    initializeEvents() {
        $('#addProduct').click(() => this.addProduct());
        $('#generateBill').click(() => this.generateBill());
        $('#saveProduct').click(() => this.saveProduct());
        $(document).on('click', '.remove-item', (e) => this.removeItem(e));
        $('#showHistory').click(() => this.showHistory());
    }

    addProduct() {
        const product = {
            name: $('#productName').val(),
            price: parseFloat($('#productPrice').val()),
            qty: parseInt($('#productQty').val()) || 1,
            gst: parseFloat($('#gstRate').val())
        };

        if(this.validateProduct(product)) {
            this.products.push(product);
            this.updateDisplay();
            this.saveUserData();
            this.clearProductInputs();
        }
    }

    validateProduct(product) {
        if(!product.name) {
            alert('Please enter product name');
            return false;
        }
        if(isNaN(product.price) || product.price <= 0) {
            alert('Please enter valid price');
            return false;
        }
        if(isNaN(product.qty) || product.qty <= 0) {
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

        $('#subtotal').text(`₹${subtotal.toFixed(2)}`);
        $('#cgst').text(`₹${(totalGst/2).toFixed(2)}`);
        $('#sgst').text(`₹${(totalGst/2).toFixed(2)}`);
        $('#grandTotal').text(`₹${(subtotal + totalGst).toFixed(2)}`);
    }

    removeItem(e) {
        const index = $(e.target).data('index');
        this.products.splice(index, 1);
        this.updateDisplay();
        this.saveUserData();
    }

    generateBill() {
        if(this.products.length === 0) {
            alert('Please add items to generate bill');
            return;
        }

        const billData = {
            customer: $('#customerName').val(),
            date: $('#invoiceDate').val(),
            number: $('#invoiceNo').val(),
            products: [...this.products],
            subtotal: parseFloat($('#subtotal').text().replace('₹', '')),
            cgst: parseFloat($('#cgst').text().replace('₹', '')),
            sgst: parseFloat($('#sgst').text().replace('₹', '')),
            total: parseFloat($('#grandTotal').text().replace('₹', ''))
        };

        this.bills.push(billData);
        this.saveUserData();
        this.generatePDF(billData);
        this.clearAll();
        alert('Bill generated successfully! PDF will download automatically.');
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

    saveProduct() {
        const product = {
            name: $('#productName').val(),
            price: parseFloat($('#productPrice').val()),
            gst: parseFloat($('#gstRate').val())
        };
        
        if(this.validateProduct(product)) {
            this.currentUser.products.push(product);
            this.saveUserData();
            this.loadProducts();
            alert('Product saved successfully!');
        }
    }

    loadProducts() {
        $('#productSelect').empty().append('<option value="">Select Saved Product</option>');
        this.currentUser.products.forEach((product, index) => {
            $('#productSelect').append(`
                <option value="${index}">
                    ${product.name} - ₹${product.price} (${product.gst}% GST)
                </option>
            `);
        });
    }

    showHistory() {
        $('#historyList').empty();
        this.bills.forEach(bill => {
            $('#historyList').append(`
                <div class="bill-card mb-3 p-3">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5>${bill.number}</h5>
                            <p class="mb-1">Customer: ${bill.customer}</p>
                            <small class="text-muted">Date: ${new Date(bill.date).toLocaleDateString()}</small>
                        </div>
                        <div class="text-end">
                            <h4 class="highlight">₹${bill.total.toFixed(2)}</h4>
                            <button class="btn btn-sm btn-primary" onclick="billingSystem.viewBill('${bill.number}')">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            `);
        });
        $('#historyModal').modal('show');
    }

    viewBill(billNumber) {
        const bill = this.bills.find(b => b.number === billNumber);
        if(bill) {
            // Implement bill detail view
            alert(`Bill Details for ${billNumber}\nCustomer: ${bill.customer}\nTotal: ₹${bill.total}`);
        }
    }

    updateInvoiceNumber() {
        const number = Math.floor(Math.random() * 900000) + 100000;
        $('#invoiceNo').val(`INV-${number}`);
    }

    clearProductInputs() {
        $('#productName, #productPrice').val('');
        $('#productQty').val(1);
    }

    clearAll() {
        this.products = [];
        $('#customerName').val('');
        $('#invoiceDate').val('');
        this.updateInvoiceNumber();
        this.updateDisplay();
        this.saveUserData();
    }

    saveUserData() {
        const users = JSON.parse(localStorage.getItem('gstUsers'));
        const index = users.findIndex(u => u.email === this.currentUser.email);
        users[index] = this.currentUser;
        localStorage.setItem('gstUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('currentUser'));
        if(data) {
            $('#customerName').val(data.customer || '');
            $('#invoiceDate').val(data.date || '');
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'auth.html';
    }
}

// Initialize billing system
let billingSystem;
$(document).ready(() => {
    billingSystem = new BillingSystem();
});

// Global logout function
function logout() {
    billingSystem.logout();
}