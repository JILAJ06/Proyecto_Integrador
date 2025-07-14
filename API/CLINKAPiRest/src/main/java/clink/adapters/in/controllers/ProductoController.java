package clink.adapters.in.controllers;

import clink.domain.usecases.producto.CreateProducto;
import io.javalin.http.Context;

public class ProductoController {
    private final CreateProducto createProducto;

    public ProductoController(CreateProducto createProducto) {
        this.createProducto = createProducto;
    }

    public void setCreateProducto(Context ctx){
        try{} catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
