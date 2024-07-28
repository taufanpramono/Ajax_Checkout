//1================================= Ajax Prices
jQuery(document).ready(function($) {
    // Fungsi untuk memperbarui harga dan kuantitas produk berdasarkan kuantitas awal
    var initialUpdatePrice = function() {
        $(".product").each(function() {
            var product_id = $(this).data("product_id");
            var quantity = $(this).find(".qty").val();

            $.ajax({
                url: woocommerce_params.ajax_url,
                type: "POST",
                data: {
                    action: "update_product_price",
                    product_id: product_id,
                    quantity: quantity
                },
                success: function(response) {
                    if (response.success) {
                        $(".product[data-product_id='" + product_id + "'] .price").html(response.data.new_price);
                    } else {
                        console.log(response.data.message); // Log error message if any
                    }
                }
            });
        });
    };

    // Update harga produk saat halaman dimuat
    initialUpdatePrice();

    // Update harga produk dan kuantitas produk saat kuantitas berubah
    $(document).on("input", ".product .qty", function() {
        var $input = $(this);
        var min_quantity = parseInt($input.attr("min"), 10);
        var value = parseInt($input.val(), 10);

        if (isNaN(value) || value < min_quantity) {
            $input.val(min_quantity);
            value = min_quantity;
        }

        var product_id = $(this).closest(".product").data("product_id");

        // Update harga produk
        $.ajax({
            url: woocommerce_params.ajax_url,
            type: "POST",
            data: {
                action: "update_product_price",
                product_id: product_id,
                quantity: value
            },
            success: function(response) {
                if (response.success) {
                    $(".product[data-product_id='" + product_id + "'] .price").html(response.data.new_price);
                } else {
                    console.log(response.data.message); // Log error message if any
                }
            }
        });

        // Update tampilan kuantitas produk
        $(".product[data-product_id='" + product_id + "'] .product-quantity").text(value);
    });

    // Prevent form submission if invalid quantity is entered
    $(document).on("keydown", ".product .qty", function(e) {
        var min_quantity = parseInt($(this).attr("min"), 10);
        if (e.key === "ArrowDown" && $(this).val() <= min_quantity) {
            e.preventDefault();
        }
    });
});


//2================================= Ajax Admin

 var woocommerce_params = {
        ajax_url: "https://rentalpapua.com/wp-admin/admin-ajax.php"
    };


//3================================= Tombol Whatsapp Dinamis
    
    jQuery(document).ready(function($) {
    // Fungsi untuk memperbarui URL tombol WhatsApp
    function updateWhatsAppButton(product_id, quantity, new_price) {
        var $product = $(".product[data-product_id='" + product_id + "']");
        var product_name = $product.data("product_name");
        var whatsapp_base_url = $product.data("whatsapp-base-url");

        if (!product_name || isNaN(new_price)) {
            console.error("Invalid product data:", {
                product_name: product_name,
                new_price: new_price
            });
            return;
        }

        var message = "Halo, saya ingin pesan produk, \n" +
                      "Nama produk : *" + product_name + "* \n" +
                      "Quantity / Jumlah : *" + quantity + "* \n" +
                      "Harga Total : *Rp " + new_price.toLocaleString('id-ID') + "*  \n\nhttps://rentalpapua.com/" ;

        var whatsapp_url = whatsapp_base_url + encodeURIComponent(message);

        $("#whatsapp-button").attr("href", whatsapp_url);
    }

    // Fungsi untuk mengupdate harga dan tombol WhatsApp
    function initialUpdateWhatsAppButton() {
        $(".product").each(function() {
            var product_id = $(this).data("product_id");
            var quantity = $(this).find(".qty").val();
            var price = $(this).data("product_price");

            if (!price) {
                console.error("Product price not found for ID:", product_id);
                return;
            }

            var new_price = price * quantity;
            updateWhatsAppButton(product_id, quantity, new_price);
        });
    }

    // Update data saat halaman dimuat
    initialUpdateWhatsAppButton();

    // Update harga produk saat kuantitas diubah
    $(document).on("input", ".product .qty", function() {
        var $input = $(this);
        var min_quantity = parseInt($input.attr("min"), 10);
        var value = parseInt($input.val(), 10);

        if (isNaN(value) || value < min_quantity) {
            $input.val(min_quantity);
            value = min_quantity;
        }

        var product_id = $(this).closest(".product").data("product_id");

        // Update harga produk melalui AJAX
        $.ajax({
            url: woocommerce_params.ajax_url,
            type: "POST",
            data: {
                action: "update_product_price",
                product_id: product_id,
                quantity: value
            },
            success: function(response) {
                if (response.success) {
                    var new_price = parseFloat(response.data.new_price.replace(/[^\d,]/g, '').replace(',', '.')); // Menghapus semua karakter kecuali angka dan koma
                    $(".product[data-product_id='" + product_id + "'] .price").html(response.data.new_price);

                    // Update URL tombol WhatsApp
                    updateWhatsAppButton(product_id, value, new_price);
                } else {
                    console.log(response.data.message); // Log error message if any
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", status, error);
            }
        });

        // Update tampilan kuantitas produk
        $(".product[data-product_id='" + product_id + "'] .product-quantity").text(value);
    });

    // Mencegah form submission jika kuantitas tidak valid
    $(document).on("keydown", ".product .qty", function(e) {
        var min_quantity = parseInt($(this).attr("min"), 10);
        if (e.key === "ArrowDown" && $(this).val() <= min_quantity) {
            e.preventDefault();
        }
    });
});

  
