package com.raxrot.back.controllers;

import com.raxrot.back.dtos.ProductFullResponse;
import com.raxrot.back.dtos.ProductRequest;
import com.raxrot.back.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/api/admin/products")
@RestController
@RequiredArgsConstructor
public class AdminProductController {
    private final ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductFullResponse> create(
            @RequestPart("data") ProductRequest productRequest,
            @RequestPart("file") MultipartFile file) {
        ProductFullResponse response = productService.create(file, productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductFullResponse> update(
            @PathVariable Long id,
            @RequestPart("data") ProductRequest productRequest,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        ProductFullResponse response = productService.update(id,file, productRequest);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProductById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("{id}/stock/{quantity}")
    public ResponseEntity<ProductFullResponse> addQuantity(@PathVariable Long id,@PathVariable Integer quantity) {
        ProductFullResponse productFullResponse=productService.addQuantity(id, quantity);
        return ResponseEntity.ok(productFullResponse);
    }
}
