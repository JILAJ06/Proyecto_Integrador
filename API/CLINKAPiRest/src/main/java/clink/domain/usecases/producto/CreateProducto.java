package clink.domain.usecases.producto;

import clink.adapters.out.repositories.RepoProducto;
import clink.domain.entities.Producto;
import clink.domain.ports.producto.CreateProductoUC;

public class CreateProducto implements CreateProductoUC {
    private final RepoProducto repoProducto;

    public CreateProducto(RepoProducto repoProducto) {
        this.repoProducto = repoProducto;
    }

    @Override
    public void createProducto(Producto producto, int idNegocio) throws Exception {
        repoProducto.crate(producto, idNegocio);
    }
}
