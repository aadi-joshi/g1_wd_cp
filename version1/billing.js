class BillingSystem {
    constructor() {
        this.products = [];
        this.loadFromLocalStorage();
        this.initializeEvents();
        this.updateInvoiceNumber();
    }

    initializeEvents() {
        $('#addProduct').click(() => this.addProduct());
        $('#generateBill').click(() => this.generateBill());
        $(document).on('click', '.remove-item', (e) => this.removeItem(e));
    }

    addProduct() {
        const product = {
            name: $('#productName').val(),
            price: parseFloat($('#productPrice').val()),
            qty: parseInt($('#productQty').val()),
            gst: parseFloat($('#gstRate').val())
        };

        if (this.validateProduct(product)) {
            this.products.push(product);
            this.updateDisplay();
            this.saveToLocalStorage();
            this.clearInputs();
        }
    }

    validateProduct(product) {
        return product.name && product.price > 0 && product.qty > 0;
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
                    <td>${product.gst}%</td>
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
        this.saveToLocalStorage();
    }

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

        // Here you can implement print functionality or PDF generation
        console.log('Generated Bill:', billData);
        alert('Bill Generated Successfully! Check console for details');
        this.clearAll();
    }

    updateInvoiceNumber() {
        const number = Math.floor(Math.random() * 1000000);
        $('#invoiceNo').val(`INV-${number}`);
    }

    clearInputs() {
        $('#productName, #productPrice, #productQty').val('');
        $('#productQty').val(1);
    }

    clearAll() {
        this.products = [];
        this.updateDisplay();
        this.updateInvoiceNumber();
        $('#customerName').val('');
        $('#invoiceDate').val('');
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem('billingData', JSON.stringify({
            products: this.products,
            customer: $('#customerName').val(),
            date: $('#invoiceDate').val()
        }));
    }

    loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('billingData'));
        if (data) {
            this.products = data.products || [];
            $('#customerName').val(data.customer || '');
            $('#invoiceDate').val(data.date || '');
            this.updateDisplay();
        }
    }
}

// Initialize the billing system when document is ready
$(document).ready(() => new BillingSystem());