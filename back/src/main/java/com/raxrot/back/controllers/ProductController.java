package com.raxrot.back.controllers;

import com.raxrot.back.configs.AppConstants;
import com.raxrot.back.dtos.product.ProductPageResponse;
import com.raxrot.back.dtos.product.ProductRequest;
import com.raxrot.back.dtos.product.ProductResponse;
import com.raxrot.back.services.ProductService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@Slf4j
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // CREATE
    @PostMapping("/admin/categories/{categoryId}/product")
    public ResponseEntity<ProductResponse> createProduct(@PathVariable Long categoryId,
                                                         @Valid @RequestBody ProductRequest productRequest) {
        log.info("POST /admin/categories/{}/product - creating product: '{}'", categoryId, productRequest.getProductName());
        ProductResponse response = productService.createProduct(categoryId, productRequest);
        log.info("Product created id={}, name='{}'", response.getProductId(), response.getProductName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // GET ALL with filters
    @GetMapping("/public/products")
    public ResponseEntity<ProductPageResponse> getAllProducts(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "category", required = false) String categoryName) {

        log.debug("GET /public/products?pageNumber={}&pageSize={}&sortBy={}&sortOrder={}&keyword={}&category={}",
                pageNumber, pageSize, sortBy, sortOrder, keyword, categoryName);

        ProductPageResponse response = productService.getAllProducts(pageNumber, pageSize, sortBy, sortOrder, keyword, categoryName);

        log.info("Fetched {} products (page {}/{})",
                response.getContent().size(),
                response.getPageNumber() + 1,
                response.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // SEARCH BY CATEGORY
    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductPageResponse> searchByCategory(
            @PathVariable Long categoryId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        log.debug("GET /public/categories/{}/products?pageNumber={}&pageSize={}&sortBy={}&sortOrder={}",
                categoryId, pageNumber, pageSize, sortBy, sortOrder);

        ProductPageResponse response = productService.searchByCategory(categoryId, pageNumber, pageSize, sortBy, sortOrder);

        log.info("Fetched {} products for categoryId={} (page {}/{})",
                response.getContent().size(),
                categoryId,
                response.getPageNumber() + 1,
                response.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // SEARCH BY KEYWORD
    @GetMapping("/public/products/keyword/{keyword}")
    public ResponseEntity<ProductPageResponse> searchByKeyword(
            @PathVariable String keyword,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        log.debug("GET /public/products/keyword/{}?pageNumber={}&pageSize={}&sortBy={}&sortOrder={}",
                keyword, pageNumber, pageSize, sortBy, sortOrder);

        ProductPageResponse response = productService.searchProductByKeyword(keyword, pageNumber, pageSize, sortBy, sortOrder);

        log.info("Fetched {} products for keyword='{}' (page {}/{})",
                response.getContent().size(),
                keyword,
                response.getPageNumber() + 1,
                response.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // UPDATE
    @PutMapping("/admin/products/{productId}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long productId,
                                                         @Valid @RequestBody ProductRequest productRequest) {
        log.info("PUT /admin/products/{} - updating product", productId);
        ProductResponse response = productService.updateProduct(productId, productRequest);
        log.info("Product updated id={}, newName='{}'", response.getProductId(), response.getProductName());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // DELETE
    @DeleteMapping("/admin/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        log.info("DELETE /admin/products/{} - deleting product", productId);
        productService.deleteProduct(productId);
        log.info("Product deleted id={}", productId);
        return ResponseEntity.noContent().build();
    }

    // UPDATE IMAGE
    @PutMapping("/admin/products/{productId}/image")
    public ResponseEntity<ProductResponse> updateProductImage(@PathVariable Long productId,
                                                              @RequestParam("image") MultipartFile image) throws IOException {
        log.info("PUT /admin/products/{}/image - updating product image", productId);
        ProductResponse response = productService.updateProductImage(productId, image);
        log.info("Product image updated id={}, newImage='{}'", response.getProductId(), response.getImage());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}