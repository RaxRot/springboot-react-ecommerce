package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.product.ProductPageResponse;
import com.raxrot.back.dtos.product.ProductRequest;
import com.raxrot.back.dtos.product.ProductResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Category;
import com.raxrot.back.models.Product;
import com.raxrot.back.repositories.CategoryRepository;
import com.raxrot.back.repositories.ProductRepository;
import com.raxrot.back.services.FileUploadService;
import com.raxrot.back.services.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Service
@Slf4j
public class ProductServiceImp implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final FileUploadService fileUploadService;

    public ProductServiceImp(ProductRepository productRepository,
                             CategoryRepository categoryRepository,
                             ModelMapper modelMapper,
                             FileUploadService fileUploadService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
        this.fileUploadService = fileUploadService;
    }

    @Override
    public ProductResponse createProduct(Long categoryId, ProductRequest productRequest) {
        log.info("Creating product in categoryId={}, name='{}'",
                categoryId, productRequest.getProductName());

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> {
                    log.warn("Category not found for id={}", categoryId);
                    return new ApiException("Category not found", HttpStatus.NOT_FOUND);
                });

        Product product = modelMapper.map(productRequest, Product.class);
        product.setCategory(category);
        product.setSpecialPrice(product.getPrice() * (1 - product.getDiscount() / 100.0));
        product.setImage("default.jpg");

        Product saved = productRepository.save(product);
        log.info("Product created id={}, name='{}'", saved.getProductId(), saved.getProductName());

        return modelMapper.map(saved, ProductResponse.class);
    }

    @Override
    public ProductPageResponse getAllProducts(Integer pageNumber, Integer pageSize,
                                              String sortBy, String sortOrder,
                                              String keyword, String categoryName) {
        log.debug("Fetching products: pageNumber={}, pageSize={}, sortBy={}, sortOrder={}, keyword='{}', category='{}'",
                pageNumber, pageSize, sortBy, sortOrder, keyword, categoryName);

        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Product> page;
        if (keyword != null && !keyword.isBlank()) {
            log.debug("Searching products by keyword='{}'", keyword);
            page = productRepository.findAllByProductNameContainingIgnoreCase(keyword, pageable);
        } else if (categoryName != null && !categoryName.isBlank()) {
            log.debug("Searching products by categoryName='{}'", categoryName);
            Category category = categoryRepository.findByCategoryNameIgnoreCase(categoryName)
                    .orElseThrow(() -> {
                        log.warn("Category not found for name='{}'", categoryName);
                        return new ApiException("Category not found", HttpStatus.NOT_FOUND);
                    });
            page = productRepository.findAllByCategory(category, pageable);
        } else {
            log.debug("Fetching all products (no filters)");
            page = productRepository.findAll(pageable);
        }

        List<ProductResponse> content = page.getContent().stream()
                .map(p -> modelMapper.map(p, ProductResponse.class))
                .toList();

        log.info("Fetched {} products (page {}/{})",
                content.size(), page.getNumber() + 1, page.getTotalPages());

        return new ProductPageResponse(content,
                page.getNumber(),
                page.getSize(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.isLast());
    }

    @Override
    public ProductPageResponse searchByCategory(Long categoryId, Integer pageNumber,
                                                Integer pageSize, String sortBy, String sortOrder) {
        log.debug("Searching products by categoryId={}, page={}, size={}", categoryId, pageNumber, pageSize);

        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> {
                    log.warn("Category not found for id={}", categoryId);
                    return new ApiException("Category not found", HttpStatus.NOT_FOUND);
                });

        Page<Product> page = productRepository.findAllByCategory(category, pageable);

        List<ProductResponse> content = page.getContent().stream()
                .map(p -> modelMapper.map(p, ProductResponse.class))
                .toList();

        log.info("Fetched {} products for categoryId={} (page {}/{})",
                content.size(), categoryId, page.getNumber() + 1, page.getTotalPages());

        return new ProductPageResponse(content,
                page.getNumber(),
                page.getSize(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.isLast());
    }

    @Override
    public ProductPageResponse searchProductByKeyword(String keyword, Integer pageNumber,
                                                      Integer pageSize, String sortBy, String sortOrder) {
        log.debug("Searching products by keyword='{}', page={}, size={}", keyword, pageNumber, pageSize);

        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Product> page = productRepository.findAllByProductNameContainingIgnoreCase(keyword, pageable);

        List<ProductResponse> content = page.getContent().stream()
                .map(p -> modelMapper.map(p, ProductResponse.class))
                .toList();

        log.info("Fetched {} products for keyword='{}' (page {}/{})",
                content.size(), keyword, page.getNumber() + 1, page.getTotalPages());

        return new ProductPageResponse(content,
                page.getNumber(),
                page.getSize(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.isLast());
    }

    @Override
    public ProductResponse updateProduct(Long productId, ProductRequest productRequest) {
        log.info("Updating product id={}, newName='{}'", productId, productRequest.getProductName());

        Product existing = productRepository.findById(productId)
                .orElseThrow(() -> {
                    log.warn("Product not found for id={}", productId);
                    return new ApiException("Product not found", HttpStatus.NOT_FOUND);
                });

        existing.setProductName(productRequest.getProductName());
        existing.setDescription(productRequest.getDescription());
        existing.setQuantity(productRequest.getQuantity());
        existing.setPrice(productRequest.getPrice());
        existing.setDiscount(productRequest.getDiscount());
        existing.setSpecialPrice(existing.getPrice() * (1 - existing.getDiscount() / 100.0));

        Product saved = productRepository.save(existing);
        log.info("Product updated id={}, name='{}'", saved.getProductId(), saved.getProductName());

        return modelMapper.map(saved, ProductResponse.class);
    }

    @Override
    public void deleteProduct(Long productId) {
        log.info("Deleting product id={}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    log.warn("Product not found for id={}", productId);
                    return new ApiException("Product not found", HttpStatus.NOT_FOUND);
                });

        fileUploadService.deleteFile(product.getImage());
        productRepository.delete(product);

        log.info("Product deleted id={}", productId);
    }

    @Override
    public ProductResponse updateProductImage(Long productId, MultipartFile image) {
        log.info("Updating product image id={}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    log.warn("Product not found for id={}", productId);
                    return new ApiException("Product not found", HttpStatus.NOT_FOUND);
                });


        if (!"default.jpg".equals(product.getImage())) {
            fileUploadService.deleteFile(product.getImage());
            log.debug("Old image deleted: {}", product.getImage());
        }

        String imageUrl = fileUploadService.uploadFile(image);
        product.setImage(imageUrl);

        Product saved = productRepository.save(product);
        log.info("Product image updated id={}, newImage={}", saved.getProductId(), imageUrl);

        return modelMapper.map(saved, ProductResponse.class);
    }
}
