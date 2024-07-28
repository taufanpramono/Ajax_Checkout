	<?php 

	function custom_product_shortcode() {
    global $product;
    $product_id = get_the_ID(); 
    $minimum_quantity = get_post_meta($product_id, 'min_quantity', true);

    if (!$product || !is_a($product, 'WC_Product')) {
        return 'Invalid product context.';
    }

    $product_name = $product->get_name();
    $product_price = $product->get_price();
    $product_price_total = $product_price * $minimum_quantity;
    $product_price_html = wc_price($product_price_total);

    $whatsapp_base_url = managementCheckoutSinggle()."?text=";
    $whatsapp_message = "Halo, saya ingin pesan produk:\n" .
                        "Nama produk: " . $product_name . "\n" .
                        "Kuantiti / Jumlah: " . $minimum_quantity . "\n" .
                        "Jumlah: Rp " . number_format($product_price_total, 0, ',', '.');

    $whatsapp_url = $whatsapp_base_url . urlencode($whatsapp_message);

    ob_start();
    ?>
    <div class="product" 
         data-product_id="<?php echo esc_attr($product_id); ?>" 
         data-product_name="<?php echo esc_attr($product_name); ?>" 
         data-product_price="<?php echo esc_attr($product_price); ?>" 
         data-whatsapp-base-url="<?php echo esc_attr($whatsapp_base_url); ?>">
        <div class="row">
            <span class="sub-total-information-two"> Jumlah / Kuantitas </span>
            <span class="product-quantity"><?php echo $minimum_quantity; ?></span>
            <hr class="gray-hr">
            <span class="sub-total-information"> Sub Total </span>
            <span class="price"><?php echo $product_price_html; ?></span>
            <hr class="gray-hr"><br>
        </div>
        <input type="number" class="qty" value="<?php echo esc_attr($minimum_quantity); ?>" min="<?php echo esc_attr($minimum_quantity); ?>" />
        <a href="<?php echo esc_url($whatsapp_url); ?>" class="whatsapp-button" target="_blank" aria-label="Chat with us on WhatsApp" id="whatsapp-button">
            <i class="fab fa-whatsapp whatsapp-icon"></i> Pesan Produk
        </a>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('custom_checkout_whatsapp', 'custom_product_shortcode');





// Handle AJAX request
function update_product_price() {
    if (isset($_POST['product_id']) && isset($_POST['quantity'])) {
        $product_id = absint($_POST['product_id']);
        $quantity = absint($_POST['quantity']);

        $product = wc_get_product($product_id);
        if ($product) {
            $price = $product->get_price();
            $new_price = $price * $quantity;

            wp_send_json_success(array('new_price' => wc_price($new_price)));
        } else {
            wp_send_json_error(array('message' => 'Invalid product'));
        }
    } else {
        wp_send_json_error(array('message' => 'Invalid request'));
    }
}
add_action('wp_ajax_update_product_price', 'update_product_price');
add_action('wp_ajax_nopriv_update_product_price', 'update_product_price');


?>