package clink.domain.ports.producto;

import clink.domain.entities.Producto;

public interface CreateProductoUC {
    public void createProducto(Producto producto, int idNegocio) throws Exception;
}
