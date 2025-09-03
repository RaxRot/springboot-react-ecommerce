package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.ProductFullResponse;
import com.raxrot.back.dtos.ProductMainPageResponse;
import com.raxrot.back.dtos.ProductPageResponse;
import com.raxrot.back.dtos.ProductRequest;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Category;
import com.raxrot.back.models.Product;
import com.raxrot.back.repositories.CategoryRepository;
import com.raxrot.back.repositories.ProductRepository;
import com.raxrot.back.services.FileUploadService;
import com.raxrot.back.services.ProductService;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final FileUploadService fileUploadService;

    @Override
    public ProductFullResponse create(MultipartFile file, ProductRequest productRequest) {

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(()->new ApiException("Category not found", HttpStatus.NOT_FOUND));

        if (file == null || file.isEmpty())
            throw new ApiException("File is empty", HttpStatus.BAD_REQUEST);
        if (file.getContentType() == null || !file.getContentType().startsWith("image/"))
            throw new ApiException("Only image files are allowed", HttpStatus.BAD_REQUEST);

        String imageUrl = fileUploadService.uploadFile(file);

        Product product = modelMapper.map(productRequest, Product.class);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        Product savedProduct = productRepository.save(product);

        ProductFullResponse response = modelMapper.map(savedProduct, ProductFullResponse.class);
        response.setCategoryName(savedProduct.getCategory().getName());
        return response;
    }

    @Override
    public ProductPageResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<Product> productsPage = productRepository.findAll(pageDetails);

        List<ProductMainPageResponse> content = productsPage.getContent().stream()
                .map(product -> new ProductMainPageResponse(
                        product.getId(),
                        product.getName(),
                        product.getImageUrl(),
                        product.getPrice(),
                        product.getCategory().getName()
                ))
                .toList();

        return new ProductPageResponse(
                content,
                productsPage.getNumber(),
                productsPage.getSize(),
                productsPage.getTotalPages(),
                productsPage.getTotalElements(),
                productsPage.isLast()
        );
    }

    @Override
    public ProductPageResponse getAllProductsByCategoryId(Long id, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<Product> productsPage = productRepository.findByCategory_Id(id, pageDetails);

        List<ProductMainPageResponse> content = productsPage.getContent().stream()
                .map(product -> new ProductMainPageResponse(
                        product.getId(),
                        product.getName(),
                        product.getImageUrl(),
                        product.getPrice(),
                        product.getCategory().getName()
                ))
                .toList();

        return new ProductPageResponse(
                content,
                productsPage.getNumber(),
                productsPage.getSize(),
                productsPage.getTotalPages(),
                productsPage.getTotalElements(),
                productsPage.isLast()
        );
    }

    @Override
    public ProductPageResponse getAllProductsByName(String name, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<Product> productsPage = productRepository.findByNameContainingIgnoreCase(name, pageDetails);

        List<ProductMainPageResponse> content = productsPage.getContent().stream()
                .map(product -> new ProductMainPageResponse(
                        product.getId(),
                        product.getName(),
                        product.getImageUrl(),
                        product.getPrice(),
                        product.getCategory().getName()
                ))
                .toList();

        return new ProductPageResponse(
                content,
                productsPage.getNumber(),
                productsPage.getSize(),
                productsPage.getTotalPages(),
                productsPage.getTotalElements(),
                productsPage.isLast()
        );
    }

    @Override
    public ProductFullResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(()->new ApiException("Product not found", HttpStatus.NOT_FOUND));
        ProductFullResponse response = modelMapper.map(product, ProductFullResponse.class);
        response.setCategoryName(product.getCategory().getName());
        return response;
    }

    @Override
    public ProductFullResponse update(Long id, MultipartFile file, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new ApiException("Category not found", HttpStatus.NOT_FOUND));

        product.setCategory(category);
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());


        if (file != null && !file.isEmpty()) {
            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                throw new ApiException("Only image files are allowed", HttpStatus.BAD_REQUEST);
            }

            if (product.getImageUrl() != null) {
                fileUploadService.deleteFile(product.getImageUrl());
            }

            String newImageUrl = fileUploadService.uploadFile(file);
            product.setImageUrl(newImageUrl);
        }

        Product savedProduct = productRepository.save(product);

        ProductFullResponse response = modelMapper.map(savedProduct, ProductFullResponse.class);
        response.setCategoryName(savedProduct.getCategory().getName());
        return response;
    }

    @Override
    public void deleteProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));

        if (product.getImageUrl() != null) {
            fileUploadService.deleteFile(product.getImageUrl());
        }

        productRepository.delete(product);
    }
}
