package clink.adapters.out.repositories;

import clink.adapters.out.DataBaseConfig;
import clink.domain.entities.Producto;

import java.sql.*;

public class RepoProducto {
    public void crate(Producto producto, int IdNegocio) throws SQLException, ClassNotFoundException {
        String sql = "INSERT INTO producto (Codigo_Prod, ID_Negocio, ID_Envase, ID_Marca, " +
                "ID_Categoria, Producto, Variedad, Cont_Neto, Medida, " +
                "Precio_Venta_Actual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try(Connection conn = DataBaseConfig.getDataSource().getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, producto.getCodigoProducto());
            stmt.setInt(2, IdNegocio);
            stmt.setInt(3, producto.getEnvase().getIdEnvase());
            stmt.setInt(4, producto.getMarca().getIdMarca());
            stmt.setInt(5, producto.getCategoria().getIdCategoria());
            stmt.setString(6, producto.getNombreComercial());
            stmt.setString(7, producto.getVariedad());
            stmt.setDouble(8, producto.getContNeto());
            stmt.setString(9, producto.getMedida().toString());
            stmt.executeUpdate();
        }
    }



    
}
